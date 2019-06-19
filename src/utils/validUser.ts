export function validUser(user: { email: string, password: string }) {
    if (user) {
        const validEmail = user.email && user.email.trim() != ''
        const validPassword = user.password && user.password.trim() != ''
        return validEmail && validPassword
    }
    return false
}