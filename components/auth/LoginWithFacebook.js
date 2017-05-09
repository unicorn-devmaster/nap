import React from 'react'
import { gql, graphql, compose } from 'react-apollo'
import persist from '../../lib/persist'
import device from '../../lib/device'
import userProfile from '../userProfile.gql'

class LoginWithFacebook extends React.Component {
  constructor(props) {
    super(props)
    this.state = { accessToken: '' }
    this.loginWithFacebook = props.loginWithFacebook
  }

  handleChange(event) {
    this.setState({ accessToken: event.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()

    const deviceInfo = e.target.elements.deviceInfo.value
    const accessToken = e.target.elements.accessToken.value

    if (deviceInfo === '' || accessToken === '') {
      window.alert('Both fields are required.')
      return false
    }

    this.loginWithFacebook(deviceInfo, accessToken)

    // reset form
    e.target.elements.deviceInfo.value = ''
    e.target.elements.accessToken.value = ''
  }

  componentDidMount() {
    persist.willGetAccessToken().then(accessToken => this.setState({ accessToken }))
  }

  render() {
    return <form onSubmit={this.handleSubmit.bind(this)}>
      <h1>Login with Facebook accessToken</h1>
      <input placeholder='deviceInfo' name='deviceInfo' defaultValue={device.info()} />
      <input placeholder='accessToken' name='accessToken' value={this.state.accessToken} onChange={this.handleChange.bind(this)} />
      <button type='submit'>Login</button>
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
  }
}

const loginWithFacebook = gql`
mutation loginWithFacebook($deviceInfo: String!, $accessToken: String!) {
  loginWithFacebook(deviceInfo: $deviceInfo, accessToken: $accessToken) {
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

LoginWithFacebook.propTypes = () => ({
  loginWithFacebook: React.PropTypes.func.isRequired
})

const withGraphQL = graphql(loginWithFacebook, {
  props: ({ mutate }) => ({
    loginWithFacebook: (deviceInfo, accessToken) => mutate({
      variables: { deviceInfo, accessToken },
      updateQueries: {
        userProfile: (previousResult, { mutationResult }) => {
          // Keep session
          persist.willSetSessionToken(mutationResult.data.loginWithFacebook.sessionToken)

          // Provide user
          return mutationResult.data.loginWithFacebook
        }
      },
      update: (proxy, { data }) => {
        // Read the data from our cache for this query.
        let cached = proxy.readQuery({ query: userProfile })

        // Modify it
        if (cached && cached.authen) {
          cached.authen.isLoggedIn = data.loginWithFacebook ? data.loginWithFacebook.isLoggedIn : false
          cached.authen.sessionToken = data.loginWithFacebook ? data.loginWithFacebook.sessionToken : null
        }

        // Write our data back to the cache.
        proxy.writeQuery({ query: userProfile, data: cached })
      }
    })
  })
})

export default compose(
  withGraphQL,
)(LoginWithFacebook)
