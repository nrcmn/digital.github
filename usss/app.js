'use strict';
console.log('app.js required');

let eventsCounter = 0;

const AuthComponent = React.createClass({
    getInitialState: function() {
        return {phone: '', password: '', error: '', repeatCount: 0};
    },
    handlePhoneChange: function (e) {
        this.setState({phone: e.target.value});
    },
    handlePasswordChange: function (e) {
        this.setState({password: e.target.value});
    },
    handleSubmit: function (e) {
        e.preventDefault();

        var xhr = $.get('https://my.beeline.ru/api/1.0/auth/auth?login=' + this.state.phone + '&password=' + this.state.password, function (result) {
            if (result.meta.code !== 20000) {
                this.state.error = 'Authenfication error, please try again!';
                this.forceUpdate();
                return
            }

            this.state.error = '';
            this.state.repeatCount++;

            this.forceUpdate();

            this.props.signInClick({ctn: this.state.phone, token: result.token});
        }.bind(this));

        xhr.fail(function() {
            this.state.error = 'Authenfication error, please try again!';
            this.forceUpdate();
        }.bind(this));
    },
    handleRepeatButton: function () {
        this.state.repeatCount++;
        this.forceUpdate();

        var event = new CustomEvent('requests.repeat', {detail: {repeat: true}});
        document.dispatchEvent(event);
    },
    render: function () {
        return (
            <div>
                <form onSubmit={this.handleSubmit} className="pure-form">
                    <fieldset>
                        <legend>Authenfication in USSS</legend>

                        <input type="tel" placeholder="Login" onChange={this.handlePhoneChange} />
                        <input type="password" placeholder="Password" onChange={this.handlePasswordChange} />

                        <p style={{color: '#F44336'}}>{this.state.error}</p>

                        <button type="submit" className="pure-button pure-button-primary">Sign in</button>
                        <legend></legend>
                    </fieldset>
                </form>

                <button onClick={this.handleRepeatButton} className="pure-button-success pure-button">Repeate requests ({this.state.repeatCount})</button>
            </div>
        )
    }
})
const SeparatedRequests = React.createClass({
    // Loader Services
    loadBalance: function () {
        this.state.balance.status = 'IN PROCESS';
        this.state.balance.time = 0;

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();
        $.ajax({
            url: "https://my.beeline.ru/api/1.0/info/prepaidAddBalance?ctn=" + ctn,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                if (!this.state.balance.list) { this.state.balance.list = new Array(); }

                this.state.balance.status = 'OK 200';
                this.state.balance.time = new Date().getTime() - startTime;
                this.state.balance.list.push(new Date().getTime() - startTime);

                var summa = this.state.balance.list.reduce((sum, current) => { return sum + current }, 0)

                this.state.balance.ave = ((summa / this.state.balance.list.length).toFixed()) + 'ms';
                this.forceUpdate();

                eventsCounter++;
                this.totalTimeCounter();
            }.bind(this)
        });
    },
    loadAccumulators: function () {
        this.state.accumulators.status = 'IN PROCESS';
        this.state.accumulators.time = 0;

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();

        $.ajax({
            url: "https://my.beeline.ru/api/1.0/info/accumulators?ctn=" + ctn,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                if (!this.state.accumulators.list) { this.state.accumulators.list = new Array(); }

                this.state.accumulators.status = 'OK 200';
                this.state.accumulators.time = new Date().getTime() - startTime;
                this.state.accumulators.list.push(new Date().getTime() - startTime);

                var summa = this.state.accumulators.list.reduce((sum, current) => { return sum + current }, 0)

                this.state.accumulators.ave = ((summa / this.state.accumulators.list.length).toFixed()) + 'ms';
                this.forceUpdate();

                eventsCounter++;
                this.totalTimeCounter();
            }.bind(this)
        });
    },
    loadPricePlan: function () {
        this.state.pricePlan.status = 'IN PROCESS';
        this.state.pricePlan.time = 0;

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();

        $.ajax({
            url: "https://my.beeline.ru/api/1.0/info/pricePlan?ctn=" + ctn,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                if (!this.state.pricePlan.list) { this.state.pricePlan.list = new Array(); }

                this.state.pricePlan.status = 'OK 200';
                this.state.pricePlan.time = new Date().getTime() - startTime;
                this.state.pricePlan.list.push(new Date().getTime() - startTime);

                var summa = this.state.pricePlan.list.reduce((sum, current) => { return sum + current }, 0)

                this.state.pricePlan.ave = ((summa / this.state.pricePlan.list.length).toFixed()) + 'ms';
                this.forceUpdate();

                eventsCounter++;
                this.totalTimeCounter();
            }.bind(this)
        });
    },
    loadServiceList: function () {
        this.state.serviceList.status = 'IN PROCESS';
        this.state.serviceList.time = 0;

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();

        $.ajax({
            url: "https://my.beeline.ru/api/1.0/info/serviceList?ctn=" + ctn,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                if (!this.state.serviceList.list) { this.state.serviceList.list = new Array(); }

                this.state.serviceList.status = 'OK 200';
                this.state.serviceList.time = new Date().getTime() - startTime;
                this.state.serviceList.list.push(new Date().getTime() - startTime);

                var summa = this.state.serviceList.list.reduce((sum, current) => { return sum + current }, 0)

                this.state.serviceList.ave = ((summa / this.state.serviceList.list.length).toFixed()) + 'ms';
                this.forceUpdate();

                eventsCounter++;
                this.totalTimeCounter();
            }.bind(this)
        });
    },
    loadSubscriptions: function () {
        this.state.subscriptions.status = 'IN PROCESS';
        this.state.subscriptions.time = 0;

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();

        $.ajax({
            url: "https://my.beeline.ru/api/1.0/info/subscriptions?ctn=" + ctn,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                if (!this.state.subscriptions.list) { this.state.subscriptions.list = new Array(); }

                this.state.subscriptions.status = 'OK 200';
                this.state.subscriptions.time = new Date().getTime() - startTime;
                this.state.subscriptions.list.push(new Date().getTime() - startTime);

                var summa = this.state.subscriptions.list.reduce((sum, current) => { return sum + current }, 0)

                this.state.subscriptions.ave = ((summa / this.state.subscriptions.list.length).toFixed()) + 'ms';
                this.forceUpdate();

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

        this.state.onlineBillDetail.status = 'IN PROCESS';
        this.state.onlineBillDetail.time = 0;

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();

        $.ajax({
            url: 'https://my.beeline.ru/api/1.0/info/onlineBillDetail?ctn=' + ctn + '&periodStart=' + startDate + '&periodEnd=' + endDate + '&sessionGroupFlag=true',
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('usss-token', 'token=' + this.props.user.token)}.bind(this),
            success: function(result) {
                if (!this.state.onlineBillDetail.list) { this.state.onlineBillDetail.list = new Array(); }

                this.state.onlineBillDetail.status = 'OK 200';
                this.state.onlineBillDetail.time = new Date().getTime() - startTime;
                this.state.onlineBillDetail.list.push(new Date().getTime() - startTime);

                var summa = this.state.onlineBillDetail.list.reduce((sum, current) => { return sum + current }, 0)

                this.state.onlineBillDetail.ave = ((summa / this.state.onlineBillDetail.list.length).toFixed()) + 'ms';
                this.forceUpdate();

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

    loadAllTogether: function () {
        this.loadBalance();
        this.loadAccumulators();
        this.loadPricePlan();
        this.loadServiceList();
        this.loadSubscriptions();
        this.loadBillingDetail();
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
        this.loadAllTogether();

        // Listen for the event.
        document.addEventListener('requests.repeat', function (e) {
            // repeat loading
            this.loadAllTogether();
        }.bind(this));
    },
    render: function () {
        return (
            <div>
                <h2>Separated requests</h2>
                <code>GET /info/prepaidAddBalance</code>
                <p><b>{this.state.balance.status}</b>, {this.state.balance.time}ms, ave {this.state.balance.ave}</p>
                <br/>
                <code>GET /info/accumulators</code>
                <p><b>{this.state.accumulators.status}</b>, {this.state.accumulators.time}ms, ave {this.state.accumulators.ave}</p>
                <br/>
                <code>GET /info/pricePlan</code>
                <p><b>{this.state.pricePlan.status}</b>, {this.state.pricePlan.time}ms, ave {this.state.pricePlan.ave}</p>
                <br/>
                <code>GET /info/serviceList</code>
                <p><b>{this.state.serviceList.status}</b>, {this.state.serviceList.time}ms, ave {this.state.serviceList.ave}</p>
                <br/>
                <code>GET /info/subscriptions</code>
                <p><b>{this.state.subscriptions.status}</b>, {this.state.subscriptions.time}ms, ave {this.state.subscriptions.ave}</p>
                <br/>
                <code>GET  /info/onlineBillDetail</code>
                <p><b>{this.state.onlineBillDetail.status}</b>, {this.state.onlineBillDetail.time}ms, ave {this.state.onlineBillDetail.ave}</p>
                <br/>
                <br/>
            </div>
        )
    }
})
const CombinedRequests = React.createClass({
    loadCombinedData: function () {
        this.state.combine.status = 'IN PROCESS';
        this.state.combine.time = 0;

        var ctn = this.props.user.ctn;
        var startTime = new Date().getTime();
        $.ajax({
            url: "https://usss-speed.herokuapp.com/api?ctn=" + ctn + "&token=" + this.props.user.token,
            type: "GET",
            success: function(result) {
                if (!this.state.combine.list) { this.state.combine.list = new Array(); }

                this.state.combine.status = 'OK 200';
                this.state.combine.time = new Date().getTime() - startTime;
                this.state.combine.list.push(new Date().getTime() - startTime);

                var summa = this.state.combine.list.reduce((sum, current) => { return sum + current }, 0)

                this.state.combine.ave = ((summa / this.state.combine.list.length).toFixed()) + 'ms';
                this.forceUpdate();
            }.bind(this)
        });
    },
    getInitialState: function () {
        return { combine: {} }
    },
    componentDidMount: function () {
        this.loadCombinedData();

        // Listen for the event.
        document.addEventListener('requests.repeat', function (e) {
            // repeat loading
            this.loadCombinedData();
        }.bind(this));
    },
    render: function () {
        return (
            <div>
                <h2>Combined requests</h2>
                <code>GET /api</code>
                <p><b>{this.state.combine.status}</b>, {this.state.combine.time}ms, ave {this.state.combine.ave}</p>
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
        this.setState({user: result});
        this.props.authOk = true;

        this.forceUpdate();
    },
    handleReload: function () { },
    render: function () {
        return (
            <div>
                <AuthComponent signInClick={this.handelSignIn} />
                {this.props.authOk ? <SeparatedRequests user={this.state.user} test={this.func} /> : null}
                {this.props.authOk ? <CombinedRequests user={this.state.user} /> : null}
            </div>
        )
    }
})

ReactDOM.render(
    <MainComponent />,
    document.getElementById('main')
);
