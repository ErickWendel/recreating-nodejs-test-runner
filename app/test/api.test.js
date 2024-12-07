import { describe, beforeEach, afterEach, it } from './../../test-runner/module/index.js'
import { deepStrictEqual, ok } from 'node:assert'
import { runSeed } from '../src/db-seed/seed.js'
import { customers } from '../src/db-seed/customers.js'
import { initializeServer } from '../src/index.js'

import CustomerUtil from './util/customer/customerUtil.js'

describe('API Workflow', () => {
    /** @type {import('node:http').Server} _testServer */
    let _testServer = null

    const customerUtil = new CustomerUtil()

    beforeEach(async () => {
        _testServer = await initializeServer()

        await new Promise((resolve, reject) => _testServer.listen(
            0,
            err => err ? reject(err) : resolve()
        ))
        const { port } = _testServer.address()
        customerUtil.setContextURL(`http://localhost:${port}`)
        await runSeed()
    })

    afterEach(async () => {
        await new Promise(resolve => _testServer.close(resolve))
        customerUtil.setContextURL('')
    })

    it('should create customer', async () => {
        const input = {
            name: 'Xuxa da Silva',
            phone: '123456789',
        }

        // Check if customer does not exist before creation
        const { result: customersBefore } = await customerUtil.getCustomers(`?name=${input.name}&phone=${input.phone}`)
        deepStrictEqual(customersBefore.length, 0)

        const expected = { message: `customer ${input.name} created!` }

        const { body, statusCode } = await customerUtil.createCustomer(input)
        ok(body._id)
        deepStrictEqual(body.message, expected.message)
        deepStrictEqual(statusCode, 201)

        // Check if customer exists after creation
        const { result: customersAfter } = await customerUtil.getCustomers(`?name=${input.name}&phone=${input.phone}`)
        deepStrictEqual(customersAfter.length, 1)
        deepStrictEqual(customersAfter[0].name, input.name)
        deepStrictEqual(customersAfter[0].phone, input.phone)
    })


    it('should retrieve only initial customers', async () => {
        return customerUtil.validateCustomersListOrderedByName(customers)
    })

    it('given 5 different customers it should have valid list', async () => {
        const customersToInsert = [
            { name: 'Erick Wendel', phone: '1111111111' },
            { name: 'Ana Neri', phone: '2222222222' },
            { name: 'Shrek de Souza', phone: '3333333333' },
            { name: 'Nemo de Oliveira', phone: '4444444444' },
            { name: 'Buzz da Rocha', phone: '5555555555' },
        ]

        await Promise.all(customersToInsert.map(item => customerUtil.createCustomer(item)))
        await customerUtil.validateCustomersListOrderedByName(customers.concat(customersToInsert))
    })

    it('should filter customers by name', async () => {
        const { name } = customers.at(0)
        const { statusCode, result } = await customerUtil.getCustomers(`?name=${name}`)
        const { _id, ...output } = result.at(0)
        ok(_id)

        deepStrictEqual(statusCode, 201)
        deepStrictEqual(output, customers.find(customer => customer.name === name))
    })

    it('should filter customers by phone', async () => {
        const { phone } = customers.at(1)
        const { statusCode, result } = await customerUtil.getCustomers(`?phone=${phone}`)
        const { _id, ...output } = result.at(0)
        ok(_id)

        deepStrictEqual(statusCode, 200)
        deepStrictEqual(output, customers.find(customer => customer.phone === phone))
    })

    it('should update customer', async () => {
        const input = {
            name: 'Xuxa da Silva',
            phone: '123456789',
        }
        const { body: { _id } } = await customerUtil.createCustomer(input)

        const updateData = { phone: '987654321' }
        const expected = { message: `customer ${_id} updated!` }

        const { body, statusCode } = await customerUtil.updateCustomer(_id, updateData)
        deepStrictEqual(body, expected)
        deepStrictEqual(statusCode, 200)

        // Check if customer updated successfully
        const { result: updatedCustomers } = await customerUtil.getCustomers(`?name=${input.name}&phone=${updateData.phone}`)
        deepStrictEqual(updatedCustomers.length, 1)
        deepStrictEqual(updatedCustomers[0].phone, updateData.phone)
        deepStrictEqual(updatedCustomers[0].name, input.name)
    })

    it('should delete customer', async () => {
        const input = {
            name: 'Xuxa da Silva',
            phone: '123456789',
        }
        const { body: { _id } } = await customerUtil.createCustomer(input)

        const expected = { message: `customer ${_id} deleted!` }

        const { body, statusCode } = await customerUtil.deleteCustomer(_id)
        deepStrictEqual(body, expected)
        deepStrictEqual(statusCode, 200)

        // Check if customer deleted successfully
        const { result: remainingCustomers } = await customerUtil.getCustomers(`?name=${input.name}&phone=${input.phone}`)
        deepStrictEqual(remainingCustomers.length, 0)
    })
})
