# -*- coding: utf-8 -*-
with open(r"app\company\jobs\create\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Remove the faulty import
content = content.replace("import * as pdfjsLib from 'pdfjs-dist';\n\n// Initialize PDF.js worker seamlessly\nif (typeof window !== 'undefined') {\n  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;\n}", "")
content = content.replace("import * as pdfjsLib from 'pdfjs-dist';", "") # Fallback just in case

# Define loadPdfJs
load_pdfjs_code = """  const [activeTab, setActiveTab] = useState(1);

  const loadPdfJs = async (): Promise<any> => {
    if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(lib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };
"""

content = content.replace("  const [activeTab, setActiveTab] = useState(1);", load_pdfjs_code)

# Replace the usage inside handleFileUpload
patch_usage = """        const fileUrl = URL.createObjectURL(file);
        const pdfjsLib = await loadPdfJs();
        const pdf = await pdfjsLib.getDocument(fileUrl).promise;"""

content = content.replace("        const fileUrl = URL.createObjectURL(file);\n        const pdf = await pdfjsLib.getDocument(fileUrl).promise;", patch_usage)

with open(r"app\company\jobs\create\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected loadPdfJs dynamic loader and removed the faulty pdfjs-dist NPM import!")
