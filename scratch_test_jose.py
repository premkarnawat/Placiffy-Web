import jwt as pyjwt
from jose import jwt, jws
from jose.exceptions import JWTError

token = pyjwt.encode({"sub": "test"}, "secret", algorithm="HS256")

try:
    jwt.decode(token, "wrong_secret", algorithms=["HS256"])
    print("Decoded!")
except Exception as e:
    print("Wrong Secret:", str(e))

token2 = pyjwt.encode({"sub": "test"}, "secret", algorithm="HS512")
try:
    jwt.decode(token2, "secret", algorithms=["HS256"])
    print("Decoded!")
except Exception as e:
    print("Wrong Alg in list:", str(e))
