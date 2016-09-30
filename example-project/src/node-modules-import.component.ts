import { Component } from "@angular/core";

export class NodeModulesImportComponent {

    public sayHello(): string {

        if (Component) {
            return "I imported a module from node_modules!";
        }

        return "This path should not be taken and should be marked as uncovered";
    }
}
