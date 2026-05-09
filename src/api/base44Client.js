/**
 * Stub for base44 client.
 * AuthContext and PageNotFound reference this module — this stub prevents
 * import errors. Replace with the real @base44/sdk integration when ready.
 */
const noop = () => Promise.reject(new Error('base44 not configured'))

export const base44 = {
  auth: {
    me: noop,
    logout: () => {},
    redirectToLogin: () => {},
  },
}
