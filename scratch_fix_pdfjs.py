# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Replace the failing import with a robust script tag injector
pdf_js_injector = """
      // 2. Fast Client-Side PDF Text Extraction using PDF.js via Script Tag
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

      const pdfjsLib = await loadPdfJs();
"""

content = re.sub(r'      // 2\. Fast Client-Side PDF Text Extraction.*?const pdfjsLib = await import\(/\* webpackIgnore: true \*/.*?;\s*pdfjsLib\.GlobalWorkerOptions\.workerSrc = .*?;', pdf_js_injector, content, flags=re.DOTALL)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected robust script-tag loader for PDF.js to completely bypass Webpack compilation errors!")
