package com.example.app.model;

/**
 * Enum representing categories for expenses as required:
 * Food, Travel, Shopping, and Other.
 */
public enum Category {
    FOOD("Food"),
    TRAVEL("Travel"),
    SHOPPING("Shopping"),
    OTHER("Other");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
