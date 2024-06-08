import { deepStrictEqual } from 'node:assert';

const JSON_HEADERS = { 'Content-Type': 'application/json' }
export default class CustomerUtil {
    #testServerAddress = ''

    setContextURL(serverAddress) {
        this.#testServerAddress = serverAddress
    }

    async createCustomer(customer) {
        const res = await fetch(`${this.#testServerAddress}/customers`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(customer),
        });
        const body = await res.json();
        return { statusCode: res.status, body };
    }

    async updateCustomer(customerId, updatedCustomer) {
        const res = await fetch(`${this.#testServerAddress}/customers/${customerId}`, {
            method: 'PATCH',
            headers: JSON_HEADERS,
            body: JSON.stringify(updatedCustomer),
        });
        const body = await res.json();
        return { statusCode: res.status, body };
    }

    async deleteCustomer(customerId) {
        const res = await fetch(`${this.#testServerAddress}/customers/${customerId}`, {
            method: 'DELETE',
        });
        const body = await res.json();
        return { statusCode: res.status, body };
    }

    async getCustomers(queryParams = '') {
        const res = await fetch(`${this.#testServerAddress}/customers${queryParams}`, {
            method: 'GET',
        });
        const result = await res.json();
        return { statusCode: res.status, result };
    }

    async validateCustomersListOrderedByName(customersSent) {
        const { statusCode, result } = await this.getCustomers();
        const expectSortedByName = customersSent.sort((a, b) => a.name.localeCompare(b.name));
        deepStrictEqual(statusCode, 200);
        const withoutId = result.map(({ _id, ...r }) => r)
        deepStrictEqual(withoutId, expectSortedByName);
    }
}
