import { LanguageFeaturesComponent } from "./language-features.component.ts";

export class DotExtensionImportComponent {

    public run(): string {

        if (LanguageFeaturesComponent) {
            return "I imported a module relative to the project using the module filename!";
        }

        return "This path should not be taken and should be marked as uncovered";
    }
}
