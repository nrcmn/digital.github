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

        unacceptableCategories = [6, 5, 4, 101, 15, 202, 23, 24, 164, 78, 80, 79, 166, 162, 165, 71, 70, 77, 122, 121, 182, 93, 86, 85, 90, 87, 163]; // unacceptable categories ids

        window.api_key = '852bff3ff459f9886729b9de223e8a0340ce008b',
            // url = 'https://public.backend.vimpelcom.ru', // public
            // url = 'https://public.backend-test.vimpelcom.ru', // public test
            // url = 'http://backend.vimpelcom.ru:8080', // internal
            url = 'http://backend-test.vimpelcom.ru:8080', // internal test

            // market_region = 98082, // Moscow
            market_region = 98220, // Ekaterinburg
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

    .filter('multiCardColor', function () {
        return function (color) {
            return color.split(';').pop();
        }
    })

angular.module('controllers', [])
    .controller('MainCategoryCtrl', function ($scope, $state, __LoadCategories, mainCategories) {
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

        window.category = {}; // for leaders loader
        $scope.categories = mainCategories;

        $scope.openCategory = function (arg) {
            window.category = arg;
            $state.go('categories');
        }
    })

    .controller('SubCategoryCtrl', function ($scope, $rootScope, $state, __LoadProducts, __LoadFilters) {
        $scope.subCategories = []; // clear subCategories
        $rootScope.intagChoicesList = []; // clear filters
        $rootScope.productsList = undefined; // clear products list
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
            __LoadProducts(window.subCategory, 15, 1, '-weight', null); // load products


            /* Cache filters */
            if (!window.filter[window.subCategory.id]) {
                __LoadFilters(window.subCategory.id);
            }
            else {
                // delete all checked filters
                window.filter[window.subCategory.id].forEach(function (item, i, arr) {
                    item.choices.forEach(function (_item, _i, _arr) {
                        delete _item['check'];
                    })
                })

                $rootScope.productsListFilter = window.filter[window.subCategory.id];
            }

            $state.go('products');
        }
    })

    .controller('ProductListCtrl', function ($scope, $rootScope, $state, $document, __LoadProducts) {

        $scope.leftFilter = false; //hide filter on left side
        window.scrollLoad = true; // progress bar status

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

            if (window.scrollLoad && (Number(window.pageYOffset.toFixed()) - (document.body.scrollHeight - window.innerHeight) >= -1500)) {
                if (lazyLoadNow) {return false} // if loading process running later

                __LoadProducts(window.subCategory, 15, window.page += 1, '-weight', $rootScope.intagChoicesList);
                $rootScope.progress = true;
                window.lazyLoadNow = true; // start lazy loading process
            }
        }

        $scope.scrollToTop = function () {
            $document.scrollTop(0, 1200).then(function() {});
        }

        $scope.openProduct = function (data) {
            data.collectionId = window.subCategory.id; // set collectionId to product data
            // product.intags_categories.forEach(function (item, i, arr) { // general intags for detail page
            //     if (item.id == 61) {
            //         product.general_intags = item;
            //     }
            // })

            window.product = data; // set this product to global variable
            $state.go('detail', {id: data.id});
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

    .controller('ProductDetailCtrl', function ($scope, $rootScope, $stateParams, $document, $state, FoundationApi, __LoadOneProduct) {
        window.scroll(0,0); // scroll to top
        (window.product && window.product.id == $stateParams.id) ? $scope.product = window.product : window.product = undefined; // back from multicard bug fix

        __LoadOneProduct($stateParams.id).then(function (data) {
            data.intags_categories.forEach(function (item, i, arr) { // general intags for detail page
                if (item.id == 61) {
                    data.general_intags = item;
                }
            })

            var multicardMemories = {};
            for (var i in data.multicard_products) {
                var multicardArrays = data.multicard_products[i];
                multicardArrays.forEach(function (item,index,arr) {
                    if (!multicardMemories[item.intag_choice] && item.intag_slug == 'obem-vstroennoi-pamiati') {
                        multicardMemories[item.intag_choice] = {
                            current: (i == data.id) ? true : false,
                            ids: []
                        };

                        multicardMemories[item.intag_choice].ids.push(i);
                    }
                    else if (multicardMemories[item.intag_choice] && item.intag_slug == 'obem-vstroennoi-pamiati') {
                        if (!multicardMemories[item.intag_choice].current) {
                            multicardMemories[item.intag_choice].current = (i == data.id) ? true : false;
                        }

                        multicardMemories[item.intag_choice].ids.push(i);
                    }

                    if (multicardMemories[item.intag_choice] && multicardMemories[item.intag_choice].current) {
                        return data.approvedIdsList = multicardMemories[item.intag_choice].ids;
                    }
                })
            }

            var colors = new Array();
            for (var i in data.multicard_products) {
                var multicardArrays = data.multicard_products[i];
                multicardArrays.forEach(function (item,index,arr) {
                    if (item.intag_slug != "obem-vstroennoi-pamiati") {
                        item.id = i;
                        colors.push(item);
                    }
                })
            }

            data.memories = multicardMemories;
            data.colors = colors;

            try {
                window.product.__proto__ = data; // load detail after product list page
            } catch (e) {
                window.product = data; // load detail without products list page
            }

            $scope.product = window.product;
            $scope.modalIntags = window.product.intags_categories[0]; // set opened intag
        })

        $scope.checkMemory = function (m) {
            for (var i in $scope.product.memories) {
                $scope.product.memories[i].current = false;
            }

            m.current = true;
            $scope.product.approvedIdsList = m.ids;
        }

        $scope.checkColor = function (id) {
            $state.go('detail', {id: id});
        }

        // open field in intags
        $scope.openField = function (f) {
            $scope.modalIntags = f;
        }

        // active style for intags
        $scope.setActiveClass = function (condition) {
            if (condition) {
                return 'active-item'
            }
            else {
                return ''
            }
        }

        $scope.openCard = function (key) {
            delete window.product;
            $state.go('detail', {id: key});
            // $state.go($state.current, {id: key}, {reload: true});
        }

        $scope.addToBasket = function () {
            $rootScope.basketBottomShow = false;

            if (!window.product.quantity) {
                window.product.quantity = 1;
            }

            for (var i = 0; i < $rootScope.basket.length; i++) {
                if ($rootScope.basket[i].id == window.product.id) {
                    if ($rootScope.basket[i].quantity == 5) {
                        FoundationApi.publish('orderNotify', { title: 'В корзину', content: 'Количество одинаковых позиций не может быть больше 5', color: 'alert', autoclose: '5000'});
                        return false
                    }
                    else {
                        FoundationApi.publish('orderNotify', { title: 'В корзину', content: 'Товар добавлен в корзину', color: 'success', autoclose: '5000'});
                        return $rootScope.basket[i].quantity += 1, $rootScope.basketProductsCount += 1, $state.go('basket.products');
                    }
                }
            }

            $rootScope.basket.push(window.product);
            $rootScope.basketProductsCount += 1;
            $state.go('basket.products');

            // FoundationApi.publish('orderNotify', { title: 'В корзину', content: 'Товар добавлен в корзину', color: 'success', autoclose: '5000'});
        }
    })

    .controller('FilterCtrl', function ($scope, $rootScope, __LoadProducts) {
        // $rootScope.intagChoicesList = []; // array for intag_choices ids
        $rootScope.filterInd = 1;
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
            window.page = 1;
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
            window.page = 1;
        }

        $rootScope.setActiveClass = function (condition) {
            if (condition) {
                return 'active-item'
            }
            else {
                return ''
            }
        }
    })

    .controller('BasketProductListCtrl', function ($scope, $rootScope, $state) {
        // clear crumbs
        $rootScope.crumbs.length = 0;

        // push mock main state
        $rootScope.crumbs.push(
            {
                animation: {
                    enter: 'fadeIn'
                },
                controller: function ($rootScope) {$rootScope.shadowShow = false;},
                getTitle: function () {return 'На главную'},
                id: 1,
                show: true,
                title: 'На главную',
                name: 'main'
            }
        )

        $scope.quantity = function (bool, item) {
            if (item.quantity == 5 && bool) {
                return false
            }
            else if (item.quantity == 1 && !bool) {
                return false
            }

            (bool) ? (item.quantity += 1, $rootScope.basketProductsCount += 1) : (item.quantity -= 1, $rootScope.basketProductsCount -= 1);
        }

        $scope.deleteItem = function (product, $index) {
            $rootScope.basketProductsCount -= product.quantity;
            $rootScope.basket.splice($index, 1);

            if ($rootScope.basket.length == 0) {
                $rootScope.basketProductsCount = 0;
            }
        }

        $scope.openProduct = function (product) {
            var cart = $state.current; // set mock "back to cart" crumb
            cart.title = 'Назад в корзину';
            cart.show = true;
            $rootScope.crumbs.push(cart);

            window.product = product;
            $state.go('basketDetail', {id: product.id});
        }
    })

    .controller('BasketFormCtrl', function ($scope, $rootScope, $timeout, $state) {
        $scope.form = {};
        $scope.form.phone = '';

        $scope.placeAnOrder = function () {
            console.log($scope.form);
            $rootScope.basket.length = 0;
            $timeout(function () {
                $state.go('main')
            }, 2000)
        }
    })

angular.module('services', [])
    .service('__LoadCategories', function ($http, $q) {
        var deferred = $q.defer();
        return function (categories) {
            $http({
                method: 'GET',
                url: window.url + '/api/public/v1/collections/',
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
                url: window.url + '/api/public/v1/products/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region,
                    collection: subCategory.id,
                    amount: amount,
                    page: page,
                    sort_by: sort,
                    intag_choices: intags,
                    point_codes: 0952
                }
            })
            .success(function (data) {
                if (data.length < amount) {
                    window.scrollLoad = false;
                    $rootScope.progress = false;
                }
                else if (data.length >= amount) {
                    window.scrollLoad = true;
                }

                if (intags && page == 1) {
                    $rootScope.productsList = data;
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

                window.lazyLoadNow = false; // end lazy loading process
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
                url: window.url + '/api/public/v1/collections/' + id + '/filters/',
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
        return function (id) {
            var deferred = $q.defer();

            var params = (!window.product) ? 'id,name,remain,price,images,article,description,old_price,intags_categories,badges,accessories,rr_recommendations,multicard_products,extended_remains' : 'description,old_price,intags_categories,badges,accessories,rr_recommendations,multicard_products,id,extended_remains';
            // TODO: add "description_small" parameter

            $http({
                method: 'GET',
                url: window.url + '/api/public/v1/products/' + id + '/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region,
                    params: params,
                    point_codes: 0952
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
    .directive("leaders", function ($timeout, $q, $http) {
        return {
            templateUrl: 'templates/leaders.html',
            replace: true,
            scope: {},
            controller: function ($scope, $http, $q, $state) {
                $scope.leaders = undefined;
                $scope.openLeader = function (data) {
                    window.product = data;
                    $state.go('leaders', {id: data.id});
                }
            },
            link: function(scope, element, attributes) {
                (function load() {
                    var deferred = $q.defer();
                    var categories = [2, 21, 8, 9];

                    $http({
                        method: 'GET',
                        url: window.url + '/api/public/v1/recommendation/popular/',
                        params: {
                            api_key: window.api_key,
                            market_region: window.market_region,
                            collection: window.category.id || categories[Math.floor(Math.random() * categories.length)],
                            params: 'article,id,images,name,price,remain,main_collection'
                        }
                    })
                    .success(function (data) {
                        var formatedData = [];
                        data.forEach(function (item, i, arr) {
                            if (unacceptableCategories.indexOf(item.main_collection.id) > -1 || item.main_collection.id == 30 || item.remain == 'временно нет' || item.remain == 'нет') {
                                return false
                            }
                            else {
                                formatedData.push(item)
                            }
                        })

                        deferred.resolve(formatedData);
                    })
                    .error(function () {
                        console.error('load leaders error');
                    })

                    return deferred.promise;
                })().then(function (result) {
                    scope.leaders = window.leaders = result;
                    $timeout(function () {
                        var swiper = new Swiper('.swiper-container', {
                            pagination: '.swiper-pagination',
                            paginationClickable: '.swiper-pagination',
                            nextButton: '.swiper-button-next',
                            prevButton: '.swiper-button-prev',
                            freeMode: false,
                            slidesPerView: 3.5,
                        });
                    }, 0.0001);
                })
            }
        }
    })

    .directive("recommendations", function ($q, $http, $timeout) {
        return {
            templateUrl: 'templates/recommendations.html',
            replace: true,
            scope: {list: '@'},
            controller: function ($scope, $state) {
                $scope.openRecomendation = function (arg) {
                    delete window.product;
                    $state.go('detail', {id: arg.id});
                }
            },
            link: function(scope, element, attributes) {
                (function () {
                    var deferred = $q.defer();
                    var i = 0;
                    window.recommendations = [];

                    function load() {
                        if (arr.length == 0 || arr[0] == '') {
                            return false;
                        }

                        var index = Math.random() * ((arr.length - 1) - 0) + 0;
                        $http({
                            method: 'GET',
                            url: window.url + '/api/public/v1/products/' + arr[index.toFixed()] + '/',
                            params: {
                                api_key: window.api_key,
                                market_region: window.market_region,
                                params: 'article,id,images,name,price,remain,main_collection'
                            }
                        })
                        .success(function (data) {
                            arr.splice(index.toFixed(), 1);
                            if (unacceptableCategories.indexOf(data.main_collection.id) > -1 || data.main_collection.id == 30 || data.remain == 'временно нет' || data.remain == 'нет') {
                                return load();
                            }
                            else {
                                window.recommendations.push(data);
                                i++;
                            }

                            if (i == 4 || arr.length == 0) {
                                deferred.resolve();
                                return false
                            }

                            load();
                        })
                        .error(function () {
                            console.error('load recommendation error');
                        })
                    }

                    scope.$watch('list', function () {
                        if (scope.list != '') {
                            arr = scope.list.replace(/[\[\]']+/g,'').split(','); // to global variable
                            load();
                        }
                    })

                    return deferred.promise;
                })().then(function () {
                    scope.recommendations = window.recommendations;

                    // $timeout(function () {
                    //     var swiper = new Swiper('.recomendation-swiper', {
                    //         nextButton: '.swiper-button-next-recomend',
                    //         prevButton: '.swiper-button-prev-recomend',
                    //         freeMode: true,
                    //         slidesPerView: 4,
                    //     });
                    // }, 0.000001);
                })
            }
        }
    })

    .directive("images", function ($timeout) {
        return {
            templateUrl: 'templates/images.html',
            replace: true,
            scope: false,
            controller: function () {
                imagesCount = 0;
            }
        }
    })

    .directive('imageonload', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    imagesCount += 1;
                    if (imagesCount == window.product.images.length) {
                        $timeout(function () {
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
                        }, 0.000001);
                    }
                });
            }
        };
    })

    .directive('key', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    var phoneLength = $scope.form.phone.length;
                    switch (phoneLength) {
                        case 0:
                            $scope.form.phone += '(';
                            break;
                        case 4:
                            $scope.form.phone += ') ';
                            break;
                        case 9:
                            $scope.form.phone += ' ';
                            break;
                        case 12:
                            $scope.form.phone += ' ';
                            break;
                        case 15:
                            return false
                    }

                    $scope.form.phone += $element[0].innerText;
                    $scope.$apply();
                })
            }
        }
    })

    .directive('clear', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    $scope.form = {};
                    $scope.form.phone = '';
                    $scope.$apply();
                })
            }
        }
    })

    .directive('backspace', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    var a = $scope.form.phone.split('');
                    a.pop();

                    $scope.form.phone = a.join('');
                    $scope.$apply();
                })
            }
        }
    })

    // basket form
    .directive('field', function () {
        return {
            controller: function ($scope, $element, $attrs) {
                $element.on('focus', function () { // listen focus on input
                    window.selectedInput = $attrs.field; // set global variable with input model name
                })
            }
        }
    })

    /* --- KEYBOARD BLOCK --- */
    .directive('keyboard', function () {
        return {
            templateUrl: 'templates/keyboard.html',
            replace: true,
            controller: function () {
                // document.addEventListener("blur", function( $event ) {
                //     // console.log($event.srcElement);
                //     window.selectedInput = null;
                // }, true);
            }
        }
    })

    // keyboard buttons
    .directive('letter', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    if ($scope.form[window.selectedInput] == undefined) {
                        $scope.form[window.selectedInput] = ''
                    }

                    $scope.form[window.selectedInput] += $element[0].innerText;
                    $scope.$apply();
                })
            }
        }
    })
    .directive('symbol', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    if ($scope.form[window.selectedInput] == undefined) {
                        $scope.form[window.selectedInput] = ''
                    }

                    $scope.form[window.selectedInput] += $element[0].innerText;
                    $scope.$apply();
                })
            }
        }
    })
    .directive('delete', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    if ($scope.form[window.selectedInput] == undefined) {
                        $scope.form[window.selectedInput] = ''
                    }

                    var a = $scope.form[window.selectedInput].split('');
                    a.pop();

                    $scope.form[window.selectedInput] = a.join('');
                    $scope.$apply();
                })
            }
        }
    })
    .directive('capslock', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    var letters = document.querySelectorAll('.letter');
                    var uppercase = document.querySelectorAll('.uppercase');

                    if (uppercase.length != 0) {
                        for (var i = 0; i < uppercase.length; i++) {
                            var arr = uppercase[i].className.split(' ');
                            arr.splice(arr.indexOf('uppercase'), 1);

                            uppercase[i].className = arr.join('');
                        }

                        return true
                    }

                    for (var i = 0; i < letters.length; i++) {
                        letters[i].className += ' uppercase';
                    }
                })
            }
        }
    })
    .directive('shift', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    var letters = document.querySelectorAll('.letter');
                    var uppercase = document.querySelectorAll('.uppercase');

                    if (uppercase.length != 0) {
                        for (var i = 0; i < uppercase.length; i++) {
                            var arr = uppercase[i].className.split(' ');
                            arr.splice(arr.indexOf('uppercase'), 1);

                            uppercase[i].className = arr.join('');
                        }

                        return true
                    }

                    for (var i = 0; i < letters.length; i++) {
                        letters[i].className += ' uppercase';
                    }

                    var listen = $scope.$watch('form', function () {
                        var uppercase = document.querySelectorAll('.uppercase');
                        for (var i = 0; i < uppercase.length; i++) {
                            var arr = uppercase[i].className.split(' ');
                            arr.splice(arr.indexOf('uppercase'), 1);

                            uppercase[i].className = arr.join('');
                        }

                        listen();
                    })
                })
            }
        }
    })
    .directive('space', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    if ($scope.form[window.selectedInput] == undefined) {
                        $scope.form[window.selectedInput] = ''
                    }

                    $scope.form[window.selectedInput] += ' ';
                    $scope.$apply();
                })
            }
        }
    })
