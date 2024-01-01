import { describe, expect, it } from "bun:test";

describe('Public Routes test', () => {

    it('auth post request', async () => {
        const resp = await fetch('http://localhost:3002/auth', {
            method: 'POST',
            body: JSON.stringify({email: 'login@login.com', password: 'password'}),
            headers: {'Content-Type': 'application/json'},
        })

        console.log(`\n${resp.body}\n`)
        expect(resp.status).toBe(200);
    })

    it('error auth request',async () => {
        const resp = await fetch('http://localhost:3002/auth', {
            method: 'POST',
            body: JSON.stringify({email: 'login', password: 'password'}),
            headers: {'Content-Type': 'application/json'},
        })

        console.log(`\n${resp.body}\n`)
        expect(resp.status).toBe(201);
    })

    it('get post request',async () => {
        const resp = await fetch('http://localhost:3002/')

        expect(resp.status).toBe(200);
    })
})