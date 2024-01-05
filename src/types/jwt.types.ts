import { TokenTypes, UserRole } from '~/constants/enums'

export type TokenPayload = {
    user_id: string
    role: UserRole
    token_type: TokenTypes
    iat: number
    exp: number
}
