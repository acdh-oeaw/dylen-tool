
export const EGO_NETWORK = 'Ego'
export const GENERAL_PARTY = 'Party'
export const GENERAL_SPEAKER = 'Speaker'

export const networkTypeMixin = {
    data() {
        return {
            EGO_NETWORK,
            GENERAL_PARTY,
            GENERAL_SPEAKER
        }
    }
}

export const NETWORK_SIZE_OK = 'OK'
export const NETWORK_SIZE_SHOW_WARNING = 'SHOW_WARNING'
export const NETWORK_SIZE_IGNORE = 'IGNORE'
export const NETWORK_SIZE_CANCEL = 'CANCEL'

export const networkSizeMixin = {
    data() {
        return {
            NETWORK_SIZE_OK,
            NETWORK_SIZE_SHOW_WARNING,
            NETWORK_SIZE_IGNORE,
            NETWORK_SIZE_CANCEL
        }
    }
}