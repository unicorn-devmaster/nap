import React from 'react'
import Link from 'next/link'
import UserProfile from '../components/UserProfile'
import PropTypes from 'prop-types'

const Header = ({ pathname }) => (
  <header>
    <UserProfile />

    <Link href='/'>
      <a className={pathname === '/' && 'is-active'}>Home</a>
    </Link>

    <Link href='/about'>
      <a className={pathname === '/about' && 'is-active'}>About</a>
    </Link>

    <style jsx>{`
      header {
        margin-bottom: 25px;
      }
      a {
        font-size: 14px;
        margin-right: 15px;
        text-decoration: none;
      }
      .is-active {
        text-decoration: underline;
      }
    `}</style>
  </header>
)

Header.propTypes = () => ({
  pathname: PropTypes.string,
  sessionToken: PropTypes.string
})

export default Header
