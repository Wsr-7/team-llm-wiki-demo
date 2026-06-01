# Demo Payment Failover Notes

When payment gateway checkout errors rise above the normal baseline, the on-call engineer should check the payment gateway health page, verify upstream provider status, and switch traffic to the backup provider only after confirming the primary provider is degraded.

The payment platform owner is staff:12345678.

The runbook should link to the payment gateway system page and should be reviewed every 90 days.
