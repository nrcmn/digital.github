console.log('app.js required');

let eventsCounter = 0;

const AuthComponent = React.createClass({
    getInitialState: function() {
        return {phone: '', password: ''};
    },
    handlePhoneChange: function (e) {
        this.setState({phone: e.target.value});
    },
    handlePasswordChange: function (e) {
        this.setState({password: e.target.value});
    },
    handleSubmit: function (e) {
        e.preventDefault();

        $.get('https://my.beeline.ru/api/1.0/auth/auth?login=' + this.state.phone + '&password=' + this.state.password, function (result) {
            this.props.signInClick({ctn: this.state.phone, token: result.token});
        }.bind(this));
    },
    render: function () {
        return (
            <form onSubmit={this.handleSubmit} className="pure-form">
                <fieldset>
                    <legend>Authenfication in USSS</legend>

                    <input type="tel" placeholder="Login" onChange={this.handlePhoneChange} />
                    <input type="password" placeholder="Password" onChange={this.handlePasswordChange} />

                    <button type="submit" className="pure-button pure-button-primary">Sign in</button>

                    <legend></legend>
                </fieldset>
            </form>
        )
    }
})
const SeparatedRequests = React.createClass({
    // Loader Services
    loadBalance: function () {
        this.setState({
            balance: {
                status: 'IN PROCESS',
                time: 0
            }
        })

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();
        $.ajax({
            url: "https://my.beeline.ru/api/1.0/info/prepaidAddBalance?ctn=" + ctn,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                this.setState(
                    { balance: {
                            status: 'OK 200',
                            time: new Date().getTime() - startTime
                        }
                    }
                )

                eventsCounter++;
                this.totalTimeCounter();
            }.bind(this)
        });
    },
    loadAccumulators: function () {
        this.setState({
            accumulators: {
                status: 'IN PROCESS',
                time: 0
            }
        })

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();

        $.ajax({
            url: "https://my.beeline.ru/api/1.0/info/accumulators?ctn=" + ctn,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                this.setState(
                    { accumulators: {
                            status: 'OK 200',
                            time: new Date().getTime() - startTime
                        }
                    }
                )

                eventsCounter++;
                this.totalTimeCounter();
            }.bind(this)
        });
    },
    loadPricePlan: function () {
        this.setState({
            pricePlan: {
                status: 'IN PROCESS',
                time: 0
            }
        })

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();

        $.ajax({
            url: "https://my.beeline.ru/api/1.0/info/pricePlan?ctn=" + ctn,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                this.setState(
                    { pricePlan: {
                            status: 'OK 200',
                            time: new Date().getTime() - startTime
                        }
                    }
                )

                eventsCounter++;
                this.totalTimeCounter();
            }.bind(this)
        });
    },
    loadServiceList: function () {
        this.setState({
            serviceList: {
                status: 'IN PROCESS',
                time: 0
            }
        })

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();

        $.ajax({
            url: "https://my.beeline.ru/api/1.0/info/serviceList?ctn=" + ctn,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                this.setState(
                    { serviceList: {
                            status: 'OK 200',
                            time: new Date().getTime() - startTime
                        }
                    }
                )

                eventsCounter++;
                this.totalTimeCounter();
            }.bind(this)
        });
    },
    loadSubscriptions: function () {
        this.setState({
            subscriptions: {
                status: 'IN PROCESS',
                time: 0
            }
        })

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();

        $.ajax({
            url: "https://my.beeline.ru/api/1.0/info/subscriptions?ctn=" + ctn,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                this.setState(
                    { subscriptions: {
                            status: 'OK 200',
                            time: new Date().getTime() - startTime
                        }
                    }
                )

                eventsCounter++;
                this.totalTimeCounter();
            }.bind(this)
        });
    },
    loadBillingDetail: function () {
        var date = new Date();
		var lastWeek = new Date(new Date().getTime()-1000*60*60*24*7);
        var startDate = lastWeek.getFullYear() + '-' + (lastWeek.getMonth() + 1) + '-' + lastWeek.getDate();
        var endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

        this.setState({
            onlineBillDetail: {
                status: 'IN PROCESS',
                time: 0
            }
        })

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();

        $.ajax({
            url: 'https://my.beeline.ru/api/1.0/info/onlineBillDetail?ctn=' + ctn + '&periodStart=' + startDate + '&periodEnd=' + endDate + '&sessionGroupFlag=true',
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                this.setState(
                    { onlineBillDetail: {
                            status: 'OK 200',
                            time: new Date().getTime() - startTime
                        }
                    }
                )

                eventsCounter++;
                this.totalTimeCounter();
            }.bind(this)
        });
    },

    totalTimeCounter: function () {
        if (eventsCounter != 6) {
            return false
        }
        else if (eventsCounter == 6) {
            var totalTime = 0;
            for (var i in this.state) {
                totalTime += this.state[i].time;
            }

            this.props.totalTime = '(' + totalTime + 'ms)';
            this.forceUpdate();
        }
    },

    getInitialState: function() {
        return {
            balance: {},
            accumulators: {},
            pricePlan: {},
            serviceList: {},
            subscriptions: {},
            onlineBillDetail: {}
        };
    },
    componentDidMount: function () {
        this.loadBalance();
        this.loadAccumulators();
        this.loadPricePlan();
        this.loadServiceList();
        this.loadSubscriptions();
        this.loadBillingDetail();
    },
    render: function () {
        return (
            <div>
                <h2>Separated requests {this.props.totalTime}</h2>
                <code>GET /info/prepaidAddBalance</code>
                <p><b>{this.state.balance.status}</b>, {this.state.balance.time}ms</p>
                <br/>
                <code>GET /info/accumulators</code>
                <p><b>{this.state.accumulators.status}</b>, {this.state.accumulators.time}ms</p>
                <br/>
                <code>GET /info/pricePlan</code>
                <p><b>{this.state.pricePlan.status}</b>, {this.state.pricePlan.time}ms</p>
                <br/>
                <code>GET /info/serviceList</code>
                <p><b>{this.state.serviceList.status}</b>, {this.state.serviceList.time}ms</p>
                <br/>
                <code>GET /info/subscriptions</code>
                <p><b>{this.state.subscriptions.status}</b>, {this.state.subscriptions.time}ms</p>
                <br/>
                <code>GET  /info/onlineBillDetail</code>
                <p><b>{this.state.onlineBillDetail.status}</b>, {this.state.onlineBillDetail.time}ms</p>
                <br/>
                <br/>
            </div>
        )
    }
})
const CombinedRequests = React.createClass({
    loadCombinedData: function () {
        this.setState({
            combine: {
                status: 'IN PROCESS',
                time: 0
            }
        })

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();
        $.ajax({
            url: "https://usss-speed.herokuapp.com/api?ctn=" + ctn + "&token=" + this.props.user.token,
            type: "GET",
            success: function(result) {
                this.setState(
                    { combine: {
                            status: 'OK 200',
                            time: new Date().getTime() - startTime
                        }
                    }
                )
            }.bind(this)
        });
    },
    getInitialState: function () {
        return { combine: {} }
    },
    componentDidMount: function () {
        this.loadCombinedData();
    },
    render: function () {
        return (
            <div>
                <h2>Combined requests</h2>
                <code>GET /api</code>
                <p><b>{this.state.combine.status}</b>, {this.state.combine.time}ms</p>
            </div>
        )
    }
})

const MainComponent = React.createClass({
    getInitialState: function () {
        return {
            user: {}
        }
    },
    handelSignIn: function (result) {
        // console.log(result);
        this.setState({user: result});
        this.props.authOk = true;

        this.forceUpdate();
    },
    render: function () {
        return (
            <div>
                <AuthComponent signInClick={this.handelSignIn} />
                {this.props.authOk ? <SeparatedRequests user={this.state.user} /> : null}
                {this.props.authOk ? <CombinedRequests user={this.state.user} /> : null}
            </div>
        )
    }
})

ReactDOM.render(
    <MainComponent />,
    document.getElementById('main')
);
