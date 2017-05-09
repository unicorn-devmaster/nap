import React from 'react'
import { gql, graphql } from 'react-apollo'
import persist from '../../lib/persist'
import userProfile from '../userProfile.gql'
import PropTypes from 'prop-types'

const SignUp = ({ signup }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    let email = e.target.elements.email.value
    let password = e.target.elements.password.value

    if (email === '' || password === '') {
      window.alert('Both fields are required.')
      return false
    }

    signup(email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>SignUp</h1>
      <input placeholder='email' name='email' defaultValue='katopz@gmail.com' />
      <input placeholder='password' name='password' defaultValue='foobar' />
      <button type='submit'>SignUp</button>
      <style jsx>{`
        form {
          border-bottom: 1px solid #ececec;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 20px;
        }
        input {
          display: block;
          margin-bottom: 10px;
        }
      `}</style>
    </form>
  )
}

const signup = gql`
mutation signup($email: String!, $password: String!) {
  signup(email: $email, password: $password) {
    isLoggedIn
    sessionToken
    user {
      _id
      name
      status
    }
  }
  errors {
    code
    message
  }
}
`

SignUp.propTypes = () => ({
  signup: PropTypes.func.isRequired
})

export default graphql(signup, {
  props: ({ mutate }) => ({
    signup: (email, password) => mutate({
      variables: { email, password },
      updateQueries: {
        userProfile: (previousResult, { mutationResult }) => {
          // Guard
          if (mutationResult.data.errors.length > 0) {
            console.error(mutationResult.data.errors[0].message) // eslint-disable-line
            return mutationResult.data.signup
          }

          // Keep session
          mutationResult.data.signup && persist.willSetSessionToken(mutationResult.data.signup.sessionToken)

          // Provide user
          return mutationResult.data.signup
        }
      },
      update: (proxy) => {
        // Read the data from our cache for this query.
        let cached = proxy.readQuery({ query: userProfile })

        // Modify it
        /* TODO : Do we need this?
        cached.authen.isLoggedIn = false
        cached.authen.sessionToken = null
        cached.user = null
        */

        // Write our data back to the cache.
        proxy.writeQuery({ query: userProfile, data: cached })
      }
    })
  })
})(SignUp)
