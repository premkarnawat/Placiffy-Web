# -*- coding: utf-8 -*-
import re

with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'<AnimatePresence mode="wait">\s*\{step === 1 && \('

new_render = """<AnimatePresence mode="wait">
              {registrationSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-600" size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    Your candidate account has been created successfully. 
                    If you haven't received a confirmation email, you can log in below.
                  </p>
                  <button 
                    onClick={() => router.push('/login')}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 bg-[#1A56DB] hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-sm"
                  >
                    Proceed to Login <ArrowRight size={18} />
                  </button>
                </motion.div>
              ) : step === 1 && ("""

if re.search(pattern, content):
    content = re.sub(pattern, new_render, content)
    with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED")
