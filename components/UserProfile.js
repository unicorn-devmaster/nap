import { gql, graphql } from 'react-apollo'
import React from 'react'
import Login from '../components/Login'
import LoginWithEmail from '../components/LoginWithEmail'
import Logout from '../components/Logout'

const UserProfile = ({ loading, user, errors }) => {

  if (errors && errors.length > 0) {
    console.log(JSON.stringify(errors)) // eslint-disable-line
  }

  if (loading) {
    return <div>Loading<hr/></div>
  }

  if (user){
    switch(user.status) {
      case 'WAIT_FOR_EMAIL_VERIFICATION':
      return <div>Please check your email</div>
      case 'VERIFIED_BY_EMAIL':
      return <div><div>Please enter your email</div><hr/><LoginWithEmail/></div>
      case 'VERIFIED_BY_EMAIL_AND_PASSWORD':
      return <div>Welcome : {user.name}<Logout/><hr/></div>
    }
  }
  return <div><Login/><hr/><LoginWithEmail/></div>
}

const userProfile = gql`
query userProfile {
  user {
    name
    status
  }
  errors {
    code
    message
  }
}
`

export default graphql(userProfile, {
  options: { fetchPolicy: 'cache-and-network' },
  props: ({ data: { loading, user, errors } }) => (
    { loading, user, errors }
  ),
})(UserProfile)
