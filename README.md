# Angular Dynamic Overflow Menu

[**Read the full post about this menu on my blog**](https://jcs.wtf/angular-dynamic-overflow-menu/)

> An "angular" approach to a very DRY dynamic overflow menu using [@angular/cdk](https://github.com/angular/components)s awesome portals.

**Problem:** You need to develop a hotizontal toolbar for a responsive web app and you have no control over how wide your users pull the window. You face an overflow problem if the window gets too small.

**Assumption:** There is no space for traditional, css-based responsiveness and horizontal scrolling is not an option because it sucks on desktop and no one would get it.

**Solution:** Define breakpoints and move the actual components into an overlay menu using cdk portals.

**Final Product:**

![dynamic overlay GIF](./dynamic-overflow-menu.gif)

# Run it yourself

1. Clone the repo
2. `npm install`
3. `npm start`
