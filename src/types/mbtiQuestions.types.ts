import { MBTIDimension, MBTIValue } from '~/constants/enums'

export type MBTIOption = {
    option: string
    dimension_value: MBTIValue
}

export type MBTIQuestion = {
    _id: string
    question: string
    dimension: MBTIDimension
    options: MBTIOption[]
    created_at: string
    updated_at: string
}
