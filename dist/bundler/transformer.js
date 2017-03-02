"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async = require("async");
var os = require("os");
var ts = require("typescript");
var Transformer = (function () {
    function Transformer(config) {
        this.config = config;
    }
    Transformer.prototype.initialize = function (logger, tsconfig) {
        this.tsconfig = tsconfig;
        this.log = logger.create("transformer.karma-typescript");
    };
    Transformer.prototype.applyTsTransforms = function (bundleQueue, onTransformssApplied) {
        var _this = this;
        var transforms = this.config.bundlerOptions.transforms;
        if (!transforms.length) {
            process.nextTick(function () {
                onTransformssApplied();
            });
            return;
        }
        async.eachSeries(bundleQueue, function (queued, onQueueProcessed) {
            var context = {
                ast: queued.emitOutput.sourceFile,
                basePath: _this.config.karma.basePath,
                filename: queued.file.originalPath,
                module: queued.file.originalPath,
                source: queued.emitOutput.sourceFile.getFullText(),
                tsVersion: ts.version,
                urlRoot: _this.config.karma.urlRoot
            };
            async.eachSeries(transforms, function (transform, onTransformApplied) {
                process.nextTick(function () {
                    transform(context, function (error, dirty) {
                        _this.handleError(error, transform);
                        if (dirty) {
                            var transpiled = ts.transpileModule(context.source, {
                                compilerOptions: _this.tsconfig.options,
                                fileName: context.filename
                            });
                            queued.emitOutput.outputText = transpiled.outputText;
                            queued.emitOutput.sourceMapText = transpiled.sourceMapText;
                        }
                        onTransformApplied();
                    });
                });
            }, onQueueProcessed);
        }, onTransformssApplied);
    };
    Transformer.prototype.applyTransforms = function (requiredModule, onTransformssApplied) {
        var _this = this;
        var transforms = this.config.bundlerOptions.transforms;
        if (!transforms.length) {
            process.nextTick(function () {
                onTransformssApplied();
            });
            return;
        }
        var context = {
            ast: requiredModule.ast,
            basePath: this.config.karma.basePath,
            filename: requiredModule.filename,
            module: requiredModule.moduleName,
            source: requiredModule.source,
            tsVersion: ts.version,
            urlRoot: this.config.karma.urlRoot
        };
        async.eachSeries(transforms, function (transform, onTransformApplied) {
            process.nextTick(function () {
                transform(context, function (error, dirty) {
                    _this.handleError(error, transform);
                    if (dirty) {
                        requiredModule.ast = context.ast;
                        requiredModule.source = context.source;
                    }
                    onTransformApplied();
                });
            });
        }, onTransformssApplied);
    };
    Transformer.prototype.handleError = function (error, transform) {
        if (error) {
            throw new Error("Unable to run transform: " + os.EOL + os.EOL +
                transform + os.EOL + os.EOL +
                "callback error parameter: " + error + os.EOL);
        }
    };
    return Transformer;
}());
exports.Transformer = Transformer;
