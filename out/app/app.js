"use strict";
/**
 * app.ts - Configures an Express application.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const indexRoute = require("./routes/index");
class Application {
    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this this.app.
     */
    static bootstrap() {
        return new Application();
    }
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        // Application instantiation
        this.app = express();
        // configure this.application
        this.config();
        // configure routes
        this.routes();
    }
    /**
     * The config function.
     *
     * @class Server
     * @method config
     */
    config() {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../client')));
        this.app.use(cors());
    }
    /**
     * The routes function.
     *
     * @class Server
     * @method routes
     */
    routes() {
        let router;
        router = express.Router();
        // create routes
        const index = new indexRoute.Index();
        // home page
        router.post('/', index.index.bind(index.index));
        // use router middleware
        this.app.use(router);
        // Gestion des erreurs
        this.app.use((req, res, next) => {
            const err = new Error('Not Found');
            next(err);
        });
        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err, req, res, next) => {
                res.status(err.status || 500);
                res.send({
                    message: err.message,
                    error: err
                });
            });
        }
        // production error handler
        // no stacktraces leaked to user (in production env only)
        this.app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: err
            });
        });
    }
}
exports.Application = Application;
//# sourceMappingURL=app.js.map