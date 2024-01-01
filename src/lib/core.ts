export function comparePassword(incomingPassword: string, hash: string) : boolean {
    return Bun.password.verifySync(incomingPassword, hash);
}