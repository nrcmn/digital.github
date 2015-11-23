angular.module('BeeStore', ['ui.router','ngAnimate', 'foundation', 'foundation.dynamicRouting.animations', 'controllers', 'directives', 'services', 'duScroll'])

    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('main', {
                url: "/",
                templateUrl: "./templates/mainCategories.html",
                getTitle: function () {return 'Главная'},
                controller: function ($rootScope) {$rootScope.shadowShow = false;},
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
                controller: function ($rootScope) {$rootScope.shadowShow = false;},
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
                controller: function ($rootScope) {$rootScope.shadowShow = true;},
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
                controller: function ($rootScope) {$rootScope.shadowShow = true;},
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
                controller: function ($rootScope) {$rootScope.shadowShow = true;},
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
                show: true,
                id: 6
            })
    })

    .run(function ($rootScope, FoundationApi, $state) {
        FastClick.attach(document.body);

        window.api_key = '852bff3ff459f9886729b9de223e8a0340ce008b',
            market_region = 98082,
            filter = {},
            page = 2;

        // Bread crumbs
        $rootScope.crumbs = [];
        $rootScope.basket = [];
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
            } catch (e) {
                console.log('ok');
            }

            return $rootScope.crumbs.push(toState);
        })

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

angular.module('controllers', [])
    .controller('MainCategoryCtrl', function ($scope, $state, __LoadCategories, mainCategories) {
        var unacceptableCategories = [6, 5, 4, 101, 15, 202, 23, 24, 164, 78, 80, 79, 166, 162, 165, 71, 70, 77, 122, 121, 182, 93, 86, 85, 90, 87, 163]; // unacceptable categories ids

        // if haven't categories data, load them
        if(!window.categories){
            __LoadCategories(unacceptableCategories).then(function (data) {
                window.categories = {
                    main: [],
                    sub: []
                }

                data.forEach(function (item, i, arr) {
                    if (unacceptableCategories.indexOf(item.id) > -1) {
                        return false
                    }
                    else if (!item.parent) {
                        window.categories.main.push(item);
                    }
                    else if (item.parent) {
                        window.categories.sub.push(item);
                    }
                })

                // $scope.categories = window.categories;

            });
        }
        // if have categories data initialize to variable
        // else {
        //     $scope.categories = window.categories;
        // }

        $scope.categories = mainCategories;

        $scope.openCategory = function (arg) {
            window.category = arg;
            $state.go('categories');
        }
    })

    .controller('SubCategoryCtrl', function ($scope, $rootScope, $state, __LoadProducts, __LoadFilters) {
        $scope.subCategories = []; // clear subCategories
        $rootScope.intagChoicesList = []; // clear filters
        $rootScope.productsList = undefined;
        window.scroll(0,0); // scroll to top
        window.page = 1; // set page number in products list
        window.sortItem = undefined; // set sortItem
        window.categories.sub.forEach(function (item, i, arr) { // all subcategories to global scope
            if (item.parent == window.category.id) {
                $scope.subCategories.push(item);
            }

            ($scope.subCategories.length <= 3) ? $scope.showLeader = true : $scope.showLeader = false; // show leader rule
        })

        $scope.openSubCategory = function (subCategory) {
            window.subCategory = subCategory; // set subCategory to global variable
            $rootScope.progress = true; // show progress bar
            __LoadProducts(window.subCategory, 10, 1, '-weight', null); // load products


            /* Cache filters */
            if (!window.filter[window.subCategory.id]) {
                __LoadFilters(window.subCategory.id);
            }
            else {
                $rootScope.cancelFilter(); // delete all later checked params
                $rootScope.productsListFilter = window.filter[window.subCategory.id];
            }

            $state.go('products');
        }
    })

    .controller('ProductListCtrl', function ($scope, $rootScope, $state, $document, __LoadProducts) {

        $scope.leftFilter = false; //hide filter on left side
        window.scrollLoad = true; // progress bar status
        __LoadProducts(window.subCategory, 5, 2, '-weight', null); // load other for empty array except

        // -- LAZY loading block
        window.onscroll = function () {

            if ($state.current.name != "products") {
                return false
            }

            if (Number(window.pageYOffset.toFixed()) > 250) {
                $scope.leftFilter = true;
                $scope.$apply();
            }
            else {
                $scope.leftFilter = false;
                $scope.$apply();
            }

            if (window.scrollLoad && (Number(window.pageYOffset.toFixed()) - (document.body.scrollHeight - window.innerHeight) >= -5)) {
                __LoadProducts(window.subCategory, 15, window.page += 1, '-weight', $rootScope.intagChoicesList);
                $rootScope.progress = true;
            }
        }

        $scope.scrollToTop = function () {
            $document.scrollTop(0, 1200).then(function() {});
        }

        $scope.openProduct = function (product) {
            product.collectionId = window.subCategory.id; // set collectionId to product data
            product.intags_categories.forEach(function (item, i, arr) { // general intags for detail page
                if (item.id == 61) {
                    product.general_intags = item;
                }
            })

            window.product = product; // set this product to global variable
            $state.go('detail', {id: product.id});
        }

        // -- SORT block
        $scope.items = [
            {
                value: '-weight',
                label: 'популярности',
            },
            {
                value: 'price',
                label: 'цене: по возрастанию',
            },
            {
                value: '-price',
                label: 'цене: по убыванию',
            }
        ];

        try {
            $scope.selected = $scope.items[window.sortItem.index]
        } catch (e) {
            window.sortItem = $scope.selected = $scope.items[0];
            window.sortItem.index = 0;
        }

        $scope.sortBy = function () {
            $rootScope.productsList = undefined;

            window.page = 1;
            window.sortItem = $scope.selected;
            $scope.items.forEach(function (item, i, arr) {
                if (item.value == $scope.selected.value) {
                    window.sortItem.index = i;
                }
            })

            __LoadProducts(window.subCategory, 15, 1, $scope.selected.value, $rootScope.intagChoicesList);
        }
    })

    .controller('ProductDetailCtrl', function ($scope, $rootScope, $stateParams, $document, __LoadOneProduct) {
        window.scroll(0,0); // scroll to top

        if (!window.product) {
            __LoadOneProduct($stateParams.id).then(function (data) {
                data.intags_categories.forEach(function (item, i, arr) { // general intags for detail page
                    if (item.id == 61) {
                        data.general_intags = item;
                    }
                })

                $scope.product = data;
                window.product = data;

                $scope.modalIntags = window.product.intags_categories[0]; // set opened intag
            })
        }
        else {
            $scope.product = window.product;
            $scope.modalIntags = window.product.intags_categories[0]; // set opened intag
        }

        // open field in intags
        $scope.openField = function (f) {
            $scope.modalIntags = f;
        }

        // active style for intags
        $scope.setActiveStyle = function (condition) {
            if (condition) {
                return {background: '#fff'}
            }
            else {
                return {background: '#ccc'}
            }
        }

        $scope.addToBasket = function () {
            window.product.quantity = 1;
            $rootScope.basket.push(window.product);
        }
    })

    .controller('FilterCtrl', function ($scope, $rootScope, __LoadProducts) {
        // $rootScope.intagChoicesList = []; // array for intag_choices ids
        $rootScope.filterInd = 0;
        $rootScope.checkFilter = function (index) {
            $rootScope.filterInd = index;
        }

        $rootScope.check = function ($event, val) {
            var checkbox = $event.target;
            if (checkbox.checked) {
                $rootScope.intagChoicesList.push(checkbox.value);
                val.check = true;
            }
            else if (!checkbox.checked) {
                $rootScope.intagChoicesList.splice($rootScope.intagChoicesList.indexOf(checkbox.value), 1);
                val.check = false;
            }
        }

        $rootScope.setFilter = function () {
            __LoadProducts(window.subCategory, 15, 1, window.sortItem.value, $rootScope.intagChoicesList);
            $rootScope.productsList = undefined;
        }

        $rootScope.clearFilter = function () {
            $rootScope.intagChoicesList.length = 0; // clear global intag choices array

            // delete all checked filters
            window.filter[window.subCategory.id].forEach(function (item, i, arr) {
                item.choices.forEach(function (_item, _i, _arr) {
                    delete _item['check'];
                })
            })

            $rootScope.productsList = undefined;
            $rootScope.progress = true; // show progress bar
            __LoadProducts(window.subCategory, 15, 1, window.sortItem.value, $rootScope.intagChoicesList);
        }

        $rootScope.setActiveStyle = function (condition) {
            if (condition) {
                return {background: '#fff'}
            }
            else {
                return {background: '#ccc'}
            }
        }
    })

angular.module('services', [])
    .service('__LoadCategories', function ($http, $q) {
        var deferred = $q.defer();
        return function (categories) {
            $http({
                method: 'GET',
                url: 'http://beeline-ecommerce.herokuapp.com/api/public/v1/collections/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region
                }
            })
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function () {
                deferred.reject('ERROR! "__LoadOneProduct"');
            })

            return deferred.promise;
        }
    })

    .service('__LoadProducts', function ($http, $rootScope) {
        return function (subCategory, amount, page, sort, intags) {
            $http({
                method: 'GET',
                url: 'http://beeline-ecommerce.herokuapp.com/api/public/v1/products/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region,
                    collection: subCategory.id,
                    amount: amount,
                    page: page,
                    sort_by: sort,
                    intag_choices: intags
                }
            })
            .success(function (data) {
                if (data.length < amount && page == 1) {
                    window.scrollLoad = false;
                    $rootScope.progress = false;
                }

                if (intags && page == 1) {
                    $rootScope.productsList = data;
                    return true
                }

                if (data.length == 0) {
                    window.scrollLoad = false;
                    $rootScope.progress = false;

                    return true
                }

                // for lazy loading function
                if (!$rootScope.productsList) {
                    $rootScope.productsList = data;
                }
                else {
                    data.forEach(function (item, i, arr) {
                        $rootScope.productsList.push(item);
                    })
                }
                //
                // $rootScope.progress = false;
            })
            .error(function () {
                console.error('ERROR! "__LoadProducts"');
            })
        }
    })

    .service('__LoadFilters', function ($http, $rootScope) {
        return function (id) {
            $http({
                method: 'GET',
                url: 'https://public.backend.vimpelcom.ru/api/public/v1/collections/' + id + '/filters/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region
                }
            })
            .success(function (data) {
                window.filter[window.subCategory.id] = data;
                $rootScope.productsListFilter = data;
                // $rootScope.filterShow = true;
            })
            .error(function () {
                console.error('ERROR! "__LoadFilters"');
                // $rootScope.filterShow = false;
            })
        }
    })

    .service('__LoadOneProduct', function ($http, $rootScope, $q) {
        var deferred = $q.defer();
        return function (id) {
            $http({
                method: 'GET',
                url: 'https://public.backend.vimpelcom.ru/api/public/v1/products/' + id + '/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region
                }
            })
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function () {
                deferred.reject('ERROR! "__LoadOneProduct"');
            })

            return deferred.promise;
        }
    })

angular.module('directives', [])
    .directive("leaders", function ($timeout) {
        return {
            templateUrl: 'templates/leaders.html',
            replace: true,
            scope: {},
            controller: function ($scope, $http, $q, $state) {
                function loadLeaders () {
                    var deferred = $q.defer();
                    var idsForLeaders = [76, 10];

                    if (Array.isArray(window.leaders)) { // cache leaders
                        deferred.resolve(window.leaders);
                        return deferred.promise;
                    }
                    else {
                        window.leaders = [];
                    }

                    idsForLeaders.forEach(function (item, i, arr) {
                        load(item, i);
                    })

                    function load (id, i) {
                        $http({
                            method: 'GET',
                            url: 'http://beeline-ecommerce.herokuapp.com/api/public/v1/products/',
                            params: {
                                api_key: window.api_key,
                                market_region: window.market_region,
                                collection: id,
                                amount: 8,
                                sort_by: '-weight'
                            }
                        })
                        .success(function (data) {
                            data.forEach(function (item, i, arr) {
                                window.leaders.push(item);
                            })

                            if (i == idsForLeaders.length - 1) {
                                deferred.resolve(window.leaders);
                            }
                        })
                    }

                    return deferred.promise;
                }

                loadLeaders().then(function (leaders) {
                    $scope.leaders = leaders;
                })

                $scope.openLeader = function (data) {
                    data.intags_categories.forEach(function (item, i, arr) { // general intags for detail page
                        if (item.id == 61) {
                            data.general_intags = item;
                        }
                    })

                    window.product = data;
                    $state.go('leaders', {id: data.id});
                }
            },
            link: function(scope, element, attributes) {
                $timeout(function () {
                    var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: '.swiper-pagination',
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev',
                        freeMode: true,
                        slidesPerView: 3.5,
                    });
                }, 1500);
            }
        }
    })

    .directive("images", function ($timeout) {
        return {
            templateUrl: 'templates/images.html',
            replace: true,
            scope: false,
            link: function () {
                $timeout(function () {
                    // var swiper = new Swiper('.swiper-container', {
                    //     pagination: '.swiper-pagination',
                    //     paginationClickable: '.swiper-pagination',
                    //     nextButton: '.swiper-button-next',
                    //     prevButton: '.swiper-button-prev'
                    // });
                    //two-way control swiper
                    var swiper1 = new Swiper('.gallery-top', {
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev',
                        spaceBetween: 10,
                    });
                    var swiper2 = new Swiper('.gallery-thumbs', {
                        spaceBetween: 10,
                        centeredSlides: true,
                        slidesPerView: 'auto',
                        touchRatio: 0.2,
                        slideToClickedSlide: true
                    });
                    swiper1.params.control = swiper2;
                    swiper2.params.control = swiper1;
                }, 1000);
            }
        }
    })
