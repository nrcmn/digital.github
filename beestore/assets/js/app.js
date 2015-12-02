angular.module('BeeStore', ['ui.router','ngAnimate', 'foundation', 'foundation.dynamicRouting.animations', 'controllers', 'directives', 'services', 'duScroll'])

    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('main', {
                url: "/",
                templateUrl: "./templates/mainCategories.html",
                getTitle: function () {return 'Главная'},
                controller: function ($rootScope) {
                    $rootScope.shadowShow = false;
                    $rootScope.basketBottomShow = true;
                },
                show: false,
                id: 1,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('categories', {
                url: "/categories",
                templateUrl: "./templates/subCategories.html",
                getTitle: function () {
                    try {
                        return window.category.name
                    } catch (e) {
                        return true
                    }
                },
                controller: function ($rootScope) {
                    $rootScope.shadowShow = false;
                    $rootScope.basketBottomShow = true;
                },
                show: true,
                id: 2,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('products', {
                url: '/categories/products',
                templateUrl: './templates/products.html',
                getTitle: function () {
                    try {
                        return window.subCategory.name
                    } catch (e) {
                        return true
                    }
                },
                controller: function ($rootScope) {
                    $rootScope.shadowShow = true;
                    $rootScope.basketBottomShow = true;
                },
                show: true,
                id: 3,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('detail', {
                url: '/categories/products/{id}',
                templateUrl: './templates/products.detail.html',
                getTitle: function () {return null}, // hide on detail page
                controller: function ($rootScope, $scope) {
                    $rootScope.shadowShow = true;
                    $scope.toCartShow = true;
                    $rootScope.basketBottomShow = true;
                },
                show: false,
                id: 4,
                animation: {
                    enter: 'fadeIn'
                }
            })

            .state('leaders', {
                url: '/leaders/{id}',
                templateUrl: './templates/products.detail.html',
                getTitle: function () {return 'Лидеры'},
                controller: function ($rootScope) {
                    $rootScope.shadowShow = true;
                    $rootScope.basketBottomShow = true;
                },
                show: true,
                id: 5,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('basket', {
                url: '/basket',
                templateUrl: './templates/basket.html',
                abstract: true
            })
            .state('basket.products', {
                url: '/products',
                templateUrl: './templates/basket.products.html',
                getTitle: function () {return 'Корзина'},
                controller: function ($rootScope) {
                    $rootScope.shadowShow = false;
                    $rootScope.basketBottomShow = false;
                },
                show: true,
                id: 6,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('basket.form', {
                url: '/form',
                templateUrl: './templates/basket.form.html',
                getTitle: function () {return 'Оформление заказа'},
                controller: function ($rootScope) {
                    $rootScope.shadowShow = false;
                    $rootScope.basketBottomShow = false;
                },
                show: true,
                id: 7,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('basketDetail', {
                url: '/basket/products/{id}',
                templateUrl: './templates/products.detail.html',
                getTitle: function () {return null}, // hide on detail page
                controller: function ($rootScope, $scope) {
                    $rootScope.shadowShow = true;
                    $scope.toCartShow = false;
                    $rootScope.basketBottomShow = true;
                },
                show: false,
                id: 8,
                animation: {
                    enter: 'fadeIn'
                }
            })

            .state('plans', {
                url: '/plans',
                templateUrl: './templates/plans.html',
                getTitle: function () {return 'Тарифы'},
                show: false,
                id: 9,
                animation: {
                    enter: 'fadeIn'
                }
            })
    })

    .run(function ($rootScope, FoundationApi, $state) {
        FastClick.attach(document.body);

        window.api_key = '852bff3ff459f9886729b9de223e8a0340ce008b',
            market_region = 98082,
            filter = {},
            page = 2;

        // Bread crumbs
        $rootScope.crumbs = []; // crumbs
        $rootScope.basket = []; // basket
        $rootScope.basketProductsCount = $rootScope.basket.length; // basket products summary count

        $rootScope.$watch('basketProductsCount', function () { // basket summary price
            var price = 0;
            $rootScope.basket.forEach(function (item, i, arr) {
                if (item.quantity) {
                    price += (item.price * item.quantity);
                }
                else {
                    price += item.price;
                }
            })

            return $rootScope.basketPrice = price; // basket summary price variable
        })

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){

            toState.title = toState.getTitle(); // get readable crumb name

            // condition for main page
            if (toState.url == '/') {
                return $rootScope.crumbs.length = 0, toState.show = false, $rootScope.crumbs.push(toState);
            }

            // for other pages
            for (var i = 0; i < $rootScope.crumbs.length; i++) {
                var crumb = $rootScope.crumbs[i];
                if (crumb.id == toState.id) {
                    return $rootScope.crumbs.splice(i + 1, 10); // back button event
                }
            }

            try {
                $rootScope.crumbs[0].show = true; // show first state in other states
            } catch (e) {console.log('ok');}

            return $rootScope.crumbs.push(toState);
        })

        /* --------- Multi-touch event handlers --------- */

        if (window.navigator.msPointerEnabled) {
            var start = 'pointerdown',
                move = 'pointermove',
                end = 'pointerup';
        }
        else {
            var start = 'touchstart',
                move = 'touchmove',
                end = 'touchend';
        }

        window.touchEvents = {};
        window.pointerCount = 0;

        document.addEventListener(start, function(event) {
            console.info('User start touch');
            window.pointerCount += 1;

            window.touchEvents = {
                start: true,
                scroll: false,
                end: false,
                e: event
            }
        }, false)

        document.addEventListener(move, function (event) {
            window.touchEvents.scroll = true;
            console.info('move event');
        }, false)

        document.addEventListener(end, function(event) {
            window.touchEvents.end = true;
            console.info('pointer count:', window.pointerCount, '\nUser end touch');

            window.pointerCount = 0;

            if (!window.touchEvents.scroll && window.pointerCount > 1) {
                var evObj = document.createEvent('Events');
                evObj.initEvent('click', true, false);
                event.target.dispatchEvent(evObj);
            }
        }, false);
        
        /* -------- END -------- */


        $rootScope.openCrumb = function (crumb) {
            $state.go(crumb.name);
        }
    })

    .value('mainCategories', [
        {
            name: 'Телефоны',
            order: 1,
            id: 2,
            img: './assets/img/phone.jpg'
        },
        {
            name: 'Планшеты',
            order: 2,
            id: 21,
            img: './assets/img/tablet.jpg'
        },
        {
            name: 'Модемы и роутеры',
            order: 3,
            id: 224,
            img: './assets/img/router.png'
        },
        {
            name: 'Гаджеты',
            order: 4,
            id: 8,
            img: './assets/img/watch.png'
        },
        {
            name: 'Аксессуары',
            order: 5,
            id: 9,
            img: './assets/img/head.jpg'
        }
    ])

    .filter('price', function () {
        return function (price) {
            var priceMask = price.toString().split('');
            priceMask.splice(-3, 0, ' ');
            return price = priceMask.join('');
        };
    })

    .filter('color', function () {
        return function (value) {
            try {
                value.forEach(function (item, i, arr) {
                    if (item.id == 21 && item.value.length < 2) {
                        item.value = item.value[0].split(';')
                    }
                })

                return value;
            } catch (e) {
                return value;
            }
        }
    })
