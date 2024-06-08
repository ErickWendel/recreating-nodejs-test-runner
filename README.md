```
▶ My suite 0
  ▶ My sub-suite 0
    ✔ test pass 00 (0.440000ms)
▶ My suite 0
  ▶ My sub-suite 1
    ✔ test pass 01 (0.120000ms)
    ✔ test pass 02 (0.020000ms)
    ✖ test fails (1.080000ms)

AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
+ actual - expected

+   {
+     "d": 2
+   }
-   {
-     "d": 1
-   }

at AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
    at file:///Users/erickwendel/Downloads/projetos/recreating-node-test-runner/test-runner/tests/example.test.js:59:13

    ✖ test fails 02 (0.160000ms)

AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
+ actual - expected

+   {
+     "d": 2
+   }
-   {
-     "d": 1
-   }

at AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
    at file:///Users/erickwendel/Downloads/projetos/recreating-node-test-runner/test-runner/tests/example.test.js:63:13

▶ SU 0
  ▶ SU 0
    ✔ haha pass (0.560000ms)
▶ Suite 0
  ▶ Sub 1
    ▶ Sub 2
      ✔ hoho pass (0.120000ms)
▶ Suite 0
  ▶ Sub 1
    ✔ hoho pass 01 (0.170000ms)
    ✔ hoho pass 02 (0.100000ms)

ℹ tests 12
ℹ suites 9
ℹ pass 10
ℹ fail 2
ℹ duration_ms 37.81
```