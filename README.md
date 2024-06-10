# Node.js Custom Test Runner Experiment

[![Build Status](https://github.com/ErickWendel/recreating-nodejs-test-runner/workflows/Docker%20Actions/badge.svg)](https://github.com/ErickWendel/recreating-nodejs-test-runner/actions)


## Introduction

This project is an experiment where I recreate the Node.js test runner using the same components. The primary goal is to understand and demonstrate the functionality of the test runner using:

- Parallelism with Child Processes
- AsyncHooks and Async LocalStorage for tracking the origin and retrieving the entire tree of tests.
- Testing API with hooks such as `describe`, `it`, `before`, `after`, `beforeEach`, `afterEach`

## Project Structure

- **[app](./app/)**: Contains a complete project which is an API with a comprehensive test suite. This suite tests each individual route and uses the custom test runner to prove the experiment's functionality.

## Test Runner Components

This custom test runner follows all the steps a test runner needs to have:

- **Executor**: Located at [./test-runner/bin/test-runner.js](./test-runner/bin/test-runner.js)
- **Formatter**: Located at [./test-runner/bin/reporter.js](./test-runner/bin/reporter.js)
- **JS API for Hooks**: Located at [./test-runner/module/testRunner.js](./test-runner/module/testRunner.js)

### Role of AsyncHooks

`AsyncHooks` are crucial for this project as they allow tracking the origin and retrieving the entire tree of tests. This helps in understanding which `describe` block all hooks belong to. Using `AsyncHooks`, the context of asynchronous operations is maintained, ensuring that hooks like `before`, `after`, `beforeEach`, and `afterEach` are correctly associated with their respective test cases.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (>=20.14)
- Docker and docker-compose (for executing [./app](./app/))

### Installation

```sh
git clone https://github.com/ErickWendel/recreating-nodejs-test-runner.git
```

## Complete app
```sh
cd recreating-nodejs-test-runner/app
docker-compose up -d
npm test
```
![](./demo2.png)

## Test runner Example

Clone the repository and install the dependencies:

```sh
cd recreating-nodejs-test-runner/test-runner
npm test
```
![](./demo.png)

## Try at home!

See at [the example](./test-runner/tests/example.test.js) and execute one of your applications there :)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## License

This project is licensed under the MIT License.

---
## Todo

- add feature so before and beforeEach executes inside sub suites
- fix log
