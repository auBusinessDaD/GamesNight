
            <Route name="examplePage" path="/example-page" component={ExamplePage} />
            <Authorized exact allowedRoles={['admin']} path="/admin/users" pathAfterFailure="/" component={AdminUsers} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
            <Authorized exact allowedRoles={['admin']} path="/admin/users/settings" pathAfterFailure="/" component={AdminUserSettings} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
            <Authorized exact allowedRoles={['admin']} path="/admin/users/:_id" pathAfterFailure="/" component={AdminUser} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
            <Route component={NotFound} />
          </Switch>
        </Grid>
        <Footer />
      </StyledApp>
    );
  }
}

App.defaultProps = {
  userId: '',
  emailAddress: '',
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  handleOnLogin: PropTypes.func.isRequired,
  handleOnLogout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
  handleOnLogin: data => dispatch(onLogin(data)),
  handleOnLogout: data => dispatch(onLogout(data)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTrackerSSR(() => {
    const app = Meteor.subscribe('app');
    const loggingIn = Meteor.loggingIn();
    const user = Meteor.user();
    const userId = Meteor.userId();
    const loading = !app.ready() && !Roles.subscription.ready();
    const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
    const emailAddress = user && user.emails && user.emails[0].address;

    return {
      loading,
      loggingIn,
      authenticated: !loggingIn && !!userId,
      name: name || emailAddress,
      roles: Roles.getRolesForUser(userId),
      userId,
      emailAddress,
      emailVerified: user && user.emails ? user && user.emails && user.emails[0].verified : true,
    };
  }),
)(App);
