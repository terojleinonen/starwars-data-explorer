# Content Cropping Fix Bugfix Design

## Overview

The content cropping issue stems from inappropriate `overflow: hidden` declarations that prevent natural scrolling behavior on mobile and tablet devices. The primary culprit is the global `body { overflow: hidden; }` rule in `src/styles/globals.css` which blocks all scrolling, causing content to be cropped when it extends beyond viewport boundaries. This fix will implement responsive overflow handling that preserves intended overflow behavior for specific components while enabling proper scrolling for page content.

## Glossary

- **Bug_Condition (C)**: The condition that triggers content cropping - when viewport dimensions are smaller than content dimensions and overflow is inappropriately hidden
- **Property (P)**: The desired behavior when content exceeds viewport - natural scrolling should be enabled while preserving component-specific overflow constraints
- **Preservation**: Existing overflow behavior for specific components (cartography background, opening crawl viewport, navigation animations) that must remain unchanged
- **PageWrapper**: The component in `src/features/common/PageLayouts/pages.module.css` that manages page-level scrolling behavior
- **Viewport Overflow**: The CSS overflow property that controls how content behaves when it exceeds container boundaries

## Bug Details

### Bug Condition

The bug manifests when content dimensions exceed viewport dimensions on mobile or tablet devices, and the global `body { overflow: hidden; }` rule prevents scrolling access to the cropped content. The CSS cascade applies this rule universally, blocking natural scrolling behavior that users expect.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type ViewportState
  OUTPUT: boolean
  
  RETURN input.contentHeight > input.viewportHeight
         OR input.contentWidth > input.viewportWidth
         AND body.overflow === 'hidden'
         AND NOT isSpecificComponentWithIntendedOverflow(input.element)
END FUNCTION
```

### Examples

- **Detail Page on Mobile**: Long content on character detail pages gets cropped at viewport bottom, with no way to scroll to see remaining content
- **Tablet Landscape Mode**: Wide content tables or panels extend beyond screen width and become inaccessible due to disabled horizontal scrolling
- **Small Mobile Screens**: Navigation elements or action buttons positioned near viewport edges get cut off and become unclickable
- **Edge Case**: Opening crawl component should maintain `overflow: hidden` for its cinematic viewport effect

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Cartography background component must continue using `overflow: hidden` to contain the map graphics within rounded borders
- Opening crawl viewport must maintain `overflow: hidden` for the cinematic scrolling animation effect
- Navigation collapse animations must preserve `overflow: hidden` during transitions
- HoloSurface components must keep `overflow: hidden` for their visual containment effects

**Scope:**
All components that do NOT require page-level scrolling should be completely unaffected by this fix. This includes:
- Component-level overflow containment for visual effects
- Animation-based overflow hiding during transitions
- Intentional content clipping for design purposes (like the cartography rounded corners)

## Hypothesized Root Cause

Based on the CSS analysis, the primary issues are:

1. **Global Body Overflow Hidden**: The `body { overflow: hidden; }` rule in `src/styles/globals.css` prevents all scrolling behavior across the application

2. **Missing Responsive Overflow Strategy**: No differentiation between page-level scrolling needs and component-level overflow containment

3. **PageWrapper Overflow Conflict**: The `.pageWrapper` class also has `overflow: hidden` which compounds the scrolling prevention

4. **Lack of Mobile-Specific Overflow Rules**: No responsive CSS rules to handle overflow differently on smaller screens where scrolling is essential

## Correctness Properties

Property 1: Bug Condition - Content Accessibility Through Scrolling

_For any_ viewport state where content dimensions exceed viewport dimensions and the element is not a component with intended overflow hiding, the fixed CSS SHALL enable appropriate scrolling (vertical and/or horizontal) to make all content accessible to users.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Component Overflow Behavior

_For any_ component that intentionally uses overflow hiding for visual or functional purposes (cartography background, opening crawl, navigation animations, holo surfaces), the fixed CSS SHALL produce exactly the same overflow behavior as the original CSS, preserving all intended visual effects and functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `src/styles/globals.css`

**Function**: Global body styles

**Specific Changes**:
1. **Remove Global Body Overflow Hidden**: Replace `body { overflow: hidden; }` with responsive overflow rules
   - Allow vertical scrolling by default: `overflow-y: auto;`
   - Prevent unwanted horizontal scrolling: `overflow-x: hidden;`

2. **Add Mobile-Specific Overflow Rules**: Implement media queries for smaller screens
   - Ensure scrolling is enabled on mobile devices
   - Maintain horizontal overflow prevention for layout stability

**File**: `src/features/common/PageLayouts/pages.module.css`

**Function**: `.pageWrapper` class

**Specific Changes**:
3. **Update PageWrapper Overflow Strategy**: Modify the page wrapper to handle scrolling appropriately
   - Remove blanket `overflow: hidden` from `.pageWrapper`
   - Implement conditional overflow based on content needs

4. **Preserve Component-Specific Overflow**: Ensure existing component overflow rules remain intact
   - Cartography background maintains `overflow: hidden` for visual containment
   - Opening crawl viewport keeps `overflow: hidden` for animation effect
   - Navigation and HoloSurface components preserve their overflow behavior

5. **Add Responsive Overflow Utilities**: Create CSS utility classes for different overflow scenarios
   - `.overflow-scroll-y` for vertical scrolling when needed
   - `.overflow-hidden-intentional` for components that require overflow hiding

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate content cropping BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Create test scenarios with content that exceeds viewport dimensions on various device sizes. Run these tests on the UNFIXED code to observe cropping behavior and confirm the overflow hidden root cause.

**Test Cases**:
1. **Mobile Detail Page Test**: Load a character detail page with long content on a mobile viewport (will show cropping on unfixed code)
2. **Tablet Wide Content Test**: Display wide data tables on tablet landscape mode (will show horizontal cropping on unfixed code)
3. **Small Screen Navigation Test**: Test navigation elements near viewport edges on small screens (will show element cropping on unfixed code)
4. **Component Overflow Test**: Verify cartography and opening crawl components work correctly (should work on unfixed code)

**Expected Counterexamples**:
- Content below the fold becomes completely inaccessible due to disabled scrolling
- Possible causes: global body overflow hidden, pageWrapper overflow hidden, missing responsive overflow rules

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed CSS produces the expected scrolling behavior.

**Pseudocode:**
```
FOR ALL viewportState WHERE isBugCondition(viewportState) DO
  result := applyFixedCSS(viewportState)
  ASSERT contentIsAccessibleThroughScrolling(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all components where the bug condition does NOT hold (intentional overflow hiding), the fixed CSS produces the same result as the original CSS.

**Pseudocode:**
```
FOR ALL component WHERE NOT isBugCondition(component) DO
  ASSERT originalCSS(component) = fixedCSS(component)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across different component types
- It catches edge cases where overflow behavior might be inadvertently changed
- It provides strong guarantees that visual effects are unchanged for components that require overflow hiding

**Test Plan**: Observe behavior on UNFIXED code first for components with intentional overflow hiding, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Cartography Background Preservation**: Verify the map graphics remain contained within rounded borders after fix
2. **Opening Crawl Animation Preservation**: Verify the cinematic scrolling effect continues to work with viewport clipping
3. **Navigation Animation Preservation**: Verify collapse/expand animations maintain their overflow hiding during transitions
4. **HoloSurface Visual Preservation**: Verify surface components maintain their visual containment effects

### Unit Tests

- Test CSS overflow rules on different viewport sizes and orientations
- Test component-specific overflow behavior remains unchanged
- Test edge cases (very small screens, very wide content, rotated devices)

### Property-Based Tests

- Generate random viewport dimensions and content sizes to verify scrolling accessibility
- Generate random component configurations to verify preservation of intended overflow behavior
- Test that visual effects continue to work correctly across many scenarios

### Integration Tests

- Test full page scrolling behavior on mobile and tablet devices
- Test component rendering with proper overflow containment after global CSS changes
- Test that user interactions (scrolling, navigation) work correctly across different screen sizes