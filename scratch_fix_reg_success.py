# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add registration success state
if "const [registrationSuccess, setRegistrationSuccess] = useState(false);" not in content:
    content = content.replace(
        "const [showConfirmPassword, setShowConfirmPassword] = useState(false);",
        "const [showConfirmPassword, setShowConfirmPassword] = useState(false);\n  const [registrationSuccess, setRegistrationSuccess] = useState(false);"
    )

# Change the logic when session is null
old_null_session = """        if (!authData.session) {
          toast('info', 'Verification', 'Please check your email to verify your account');
          return;
        }"""
        
new_null_session = """        if (!authData.session) {
          // If confirm email is enabled in Supabase, show a success screen
          setRegistrationSuccess(true);
          return;
        }"""

if old_null_session in content:
    content = content.replace(old_null_session, new_null_session)

# If registrationSuccess is true, render a success screen instead of the form!
old_render = """              <AnimatePresence mode="wait">
                {step === 1 && ("""

new_render = """              <AnimatePresence mode="wait">
                {registrationSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                      We have sent a confirmation email to <span className="font-semibold text-gray-900">{formData.email}</span>. 
                      Please check your inbox (and spam folder) to verify your account.
                    </p>
                    <button 
                      onClick={() => router.push('/login')}
                      className="inline-flex items-center justify-center gap-2 bg-[#1A56DB] hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-sm"
                    >
                      Proceed to Login <ArrowRight size={18} />
                    </button>
                    <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500">
                      If you don't want to use email confirmations, you can disable them in your Supabase Auth settings.
                    </div>
                  </motion.div>
                ) : step === 1 && ("""

if old_render in content:
    content = content.replace(old_render, new_render)
else:
    print("WARNING: Could not find old_render")

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
