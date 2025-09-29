import re
from playwright.sync_api import sync_playwright, Page, expect

def test_theme_packaging(page: Page):
    """
    This test verifies that the theme is correctly packaged and applied
    by navigating to a Storybook story that uses the new theme package.
    """
    # 1. Arrange: Go to the Storybook story.
    # The storybook is running on port 6006.
    page.goto("http://localhost:6006/?path=/story/industrymarkdown-slidepresentationwiththemeswitcher--theme-switcher-demo")

    # The story is inside an iframe, so we need to get the frame locator.
    iframe_locator = page.frame_locator("#storybook-preview-iframe")

    # 2. Assert: Wait for the slide content to be visible in the iframe.
    # This confirms that the story has loaded correctly.
    # We'll look for the heading of the first slide.
    expect(iframe_locator.get_by_role("heading", name="Theme Switcher Demo")).to_be_visible(timeout=30000)

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/theme-packaging-verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        test_theme_packaging(page)
        browser.close()

if __name__ == "__main__":
    main()