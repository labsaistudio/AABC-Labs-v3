# Security

AABC Labs v3 is a clean public implementation of the workflow architecture.
It does not require private keys, provider credentials, production deployment
tokens, or hosted database access.

Please do not submit secrets in issues, pull requests, screenshots, or logs.
If you find a boundary issue in the reference runtime, open a private security
advisory or contact the maintainers directly.

The reference adapters do not broadcast transactions. They emit prepared
transaction records, policy gate decisions, proof artifacts, and source
package manifests.
