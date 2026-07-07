# Example entry: payment gateway nightly batch timeout (safe to delete)

> This is an example inbox entry (fictional), showing what a "5-minute capture" looks like. Delete once real entries exist.

One line: the reconciliation batch job timed out in the early hours of Jul 7; root cause was the connection pool config not being adjusted after the last scale-out; recovered after a temporary pool increase.

- System: payment-gateway (reconciliation batch job)
- Time: 2026-07-07 ~02:30, lasted about 40 minutes
- People: staff:12345678 (mitigation), staff:23456789 (review)
- Links: https://jira.example.com/browse/PAY-9999 (fictional)

What happened / how it was resolved:

1. 02:30 batch job timeout alert; two retries failed.
2. Pool metrics showed active connections pegged at the limit; instances were scaled 2 → 4 last week but the pool cap was never raised.
3. Temporarily raised `pool.maxSize` from 20 to 50; job rerun succeeded.
4. Follow-up: add this config to the scale-out checklist (fold into the runbook page when it is written).

## Raw notes

> [02:41] xxx: 连接池 active 一直是 20 顶着，扩容之后配置没动过
>   (gloss: pool active count pegged at 20; config untouched since the scale-out)
> [02:43] yyy: 调到 50 试试，历史峰值 35 左右
>   (gloss: try 50; historical peak is around 35)
> (Chat records without a stable URL get pasted here — this file is the raw layer; git history keeps it forever.)
