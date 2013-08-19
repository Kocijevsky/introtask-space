/**
 * Создает экземпляр космического корабля.
 * @name Vessel
 * @param {String} name Название корабля.
 * @param {Number}[] position Местоположение корабля.
 * @param {Number} capacity Грузоподъемность корабля.
 */
function Vessel(name, position, capacity) {
    var self = this;
    var _name = null,
        _position = null,
        _capacity = null,
        _cargo = 0;
    var _planet = null;

    _name = !name ? helper.getRandomShipName() : name;
    _position = ( Object.prototype.toString.call(position) == '[object Array]' &&
        typeof position[0] == "number" &&
        typeof position[1] == "number")
        ? position
        : [0, 0];
    _capacity = (parseInt(capacity) > 0) ? capacity : Math.floor(Math.random() * 20000);


    /**
     * Выводит текущее состояние корабля: имя, местоположение, доступную грузоподъемность.
     * @example
     * vessel.report(); // Грузовой корабль. Местоположение: Земля. Товаров нет.
     * @example
     * vesserl.report(); // Грузовой корабль. Местоположение: 50,20. Груз: 200т.
     * @name Vessel.report
     */

    self.report = function () {
        var name = _name + ". ";
        var position = "Местоположение: " + _position[0] + "," + _position[1] + " ";
        var cargo = _cargo ? "Груз: " + _cargo + "т." : "Товаров нет.";
        var planet = (_planet != null) ? (" Корабль в доке планеты" + _planet.getName()) : " Мы в открытом космосе"
        return name + position + cargo + planet;
    };

    self.getPosition = function () {
        return  _position;
    }

    /**
     * Выводит количество свободного места на корабле.
     * @name Vessel.getFreeSpace
     */
    self.getFreeSpace = function () {
        return(_capacity - _cargo);
    };

    /**
     * Выводит количество занятого места на корабле.
     * @name Vessel.getOccupiedSpace
     */

    self.getOccupiedSpace = function () {
        return _cargo;
    };

    /**
     * Переносит корабль в указанную точку.
     * @param {Number}[]|Planet newPosition Новое местоположение корабля.
     * @example
     * vessel.flyTo([1,1]);
     * @example
     * var earth = new Planet('Земля', [1,1]);
     * vessel.flyTo(earth);
     * @name Vessel.report
     */

    self.flyTo = function (newPosition) {
        if (!_planet) {
            var cords = null;
            if (typeof newPosition == "string" && typeof window[planetName] != undefined)
                cords = window[planetName].getPosition(); //хитрый план на случай передачи имени переменно вместо переменной
            if (Object.prototype.toString.call(newPosition) == '[object Array]')
                cords = newPosition;
            if (typeof newPosition == "object" && typeof newPosition.getPosition == "function")
                cords = newPosition.getPosition();
            cords ? flyToPoint(cords) : console.log("Не могу найти на карте");
        } else {
            console.log("сначала нцужно взлететь");
        }
    };

    self.lendToPlanet = function (planet) {
        if (typeof planet == "object" && typeof planet.allowLanding == "function") {
            if (planet.allowLanding(self)) {
                _planet = planet;
                console.log("Мягкая посадка");
            }
        } else {
            console.log("Здесь такой планеты точно нет");
        }
    };

    self.takeOffThePlanet = function () {
        if (!_planet) {
            console.log("Корабль в космосе, о чем вы?");
        } else if (_planet.allowTakeOff(self)) {
            _planet == null;
            console.log("Взлетели, можем двигаться дальше");
        }

    };

    function flyToPoint(cords) {
        console.log("Летим в Указанную точку...");
        var fly = setTimeout(function () {
                console.log("Мы на месте. Да так быстро");
                _position = cords;
                clearTimeout(fly)
            },
            800
        )
    };

    self.receiveCargo = function (cargoWeight) {
        if (!_planet) {
            console.log("Корабль в космосе, загружать нельзя");
            return false
        } else {
            _cargo += cargoWeight;
            return true;
        }
    };
    self.uploadCargo = function (cargoWeight) {
        if (!_planet) {
            console.log("Корабль в космосе, выгружать нельзя");
            return false
        } else {
            _cargo -= cargoWeight;
            return true;
        }
    };

};

/**
 * Создает экземпляр планеты.
 * @name Planet
 * @param {String} name Название Планеты.
 * @param {Number}[] position Местоположение планеты.
 * @param {Number} availableAmountOfCargo Доступное количество груза.
 */
function Planet(name, position, availableAmountOfCargo) {
    var self = this;
    var _name = null,
        _position = null,
        _cargo = 0;
    var ships = [];

    _name = !name ? helper.getRandomPlanetName() : name;
    _position = ( Object.prototype.toString.call(position) == '[object Array]' &&
        typeof position[0] == "number" &&
        typeof position[1] == "number")
        ? position
        : [Math.floor(Math.random() * 100), Math.floor(Math.random() * 1000)];
    _cargo = (parseInt(availableAmountOfCargo) > 0) ?
        availableAmountOfCargo : Math.floor(Math.random() * 20000);

    /**
     * Выводит текущее состояние планеты: имя, местоположение, количество доступного груза.
     * @name Planet.report
     */
    self.getName = function () {
        return _name;
    };

    self.report = function () {
        var name = _name + ". ";
        var position = "Местоположение: " + _position[0] + "," + _position[1] + " ";
        var cargo = _cargo ? "Груз: " + _cargo + "т." : "Товаров нет.";
        return name + position + cargo;
    };

    self.getPosition = function () {
        return  _position;
    };

    self.getAvailableAmountOfCargo = function () {
        return _cargo;
    }

    self.allowLanding = function (vessel) {
        if (vessel.getPosition() == _position) {
            ships.push(vessel)
            return true;
        }
        return false;
    };
    self.allowTakeOff = function (vessel) {
        var index = ships.indexOf(vessel);
        if (index >= 0) {
            ships.splice(index, 1);
            return true
        }
        console.log("В доках нет такого корабля");
        return false;
    };
    /**
     * Загружает на корабль заданное количество груза.
     *
     * Перед загрузкой корабль должен приземлиться на планету.
     * @param {Vessel} vessel Загружаемый корабль.
     * @param {Number} cargoWeight Вес загружаемого груза.
     * @name Vessel.loadCargoTo
     */
    self.loadCargoTo = function (vessel, cargoWeight) {
        var index = ships.indexOf(vessel);
        if (index < 0) {
            console.log("Такого корабля в доках нет");
            return false;
        }
        if (cargoWeight > _cargo) {
            console.log("У нас не так много груза");
            return false;
        }
        if (cargoWeight > vessel.getFreeSpace()) {
            console.log("Все это в корабль не поместиться");
            return false;
        } else {
            if (vessel.receiveCargo(cargoWeight)) {
                _cargo -= cargoWeight;
            }
        }
    };

    self.unloadCargoFrom = function (vessel, cargoWeight) {
        var index = ships.indexOf(vessel);
        if (index < 0) {
            console.log("Такого корабля в доках нет");
            return false;
        }
        if (cargoWeight > vessel.getOccupiedSpace()) {
            console.log("В этом корабле нет столько груза");
            return false;
        } else {
            if (vessel.uploadCargo(cargoWeight)) {
                _cargo += cargoWeight
            }
        }
    };

};
