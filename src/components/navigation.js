// Import from packages
import React, { Component } from 'react';
import { Link } from 'react-router-dom';


/**
 * Container for navigation component
 *
 * Manages the top menu and logout functionality.
 *
 * @extends {Component}
 */
class NavigationContainer extends Component {
  /**
   * @override
   *
   * Sets initial component state.
   *
   * Note that data passed from parent may be empty at this moment, as it
   * is fetched asynchronously.
   *
   * @param {Object} props - properties received from parent component
   */
  constructor(props) {
    super(props);

    this.state = {
      pages: [
        { key: 'exchange-overview', name: 'Exchange overview', url: process.env.PUBLIC_URL + '/', active: false, visible: true },
        { key: 'token-trading', name: 'RooCoin trading',  url: process.env.PUBLIC_URL + '/token-trading', active: false, visible: true },
        { key: 'token-mgmt', name: 'Token management', url: process.env.PUBLIC_URL + '/token-mgmt', active: false, visible: true }
      ]
    };
  }

  /**
   * Find out which page that is active
   *
   * use window to get the current active path name to save for the active page
   * in the menu. The active page will then get the teal bottom border.
   */
  updatePageActive() {
    const pages = this.state.pages.map(page => {
      page.active = window.location.pathname === page.url;
      return page;
    });
    this.setState({ pages: pages });
  }

  componentDidMount() {
    this.updatePageActive();
  }

  /**
   * React hook which gets executed when component will receive new parameters.
   *
   * Note that this method will only get executed if account data (fetched
   * asynchronously) was not available at the moment {@link componentDidMount}
   * was executed.
   *
   * @param {object} nextProps - properties received from parent component
   */
  componentWillReceiveProps(nextProps) {
    this.updatePageActive();
  }

  /**
   * Renders the {@link NavigationUI} component
   */
  render() {
    return (
      <nav className="navbar pure-menu pure-menu-horizontal">
        <a href={ process.env.PUBLIC_URL + '/' } className="pure-menu-heading pure-menu-link"></a>
        
        <ul className="pure-menu-list">
            {
              this.state.pages.map((page, i) => (
                <li className={'pure-menu-item' + (page.active ? ' pure-menu-selected' : '') } key={i}>
                  <Link
                    to={page.url}
                    className={'link-container pure-menu-link' } >
                    {page.name}
                  </Link>
                </li>
            ))}
        </ul>
      </nav>
    );
  }
}

export default NavigationContainer;
