#openssl pkcs12 -in cert.p12 -out cert.pem -clcerts -nokeys
openssl rsa -in cert.key -out nopass.key
