export function setupDomMocks(): void {
  // ResizeObserver mock
  if (typeof window.ResizeObserver === 'undefined') {
    class ResizeObserver {
      observe = () => {};
      unobserve = () => {};
      disconnect = () => {};
    }

    window.ResizeObserver = ResizeObserver;
  }

  // IntersectionObserver mock
  if (typeof window.IntersectionObserver === 'undefined') {
    class IntersectionObserver {
      observe = () => {};
      unobserve = () => {};
      disconnect = () => {};
      takeRecords = () => [];
    }
    // @ts-expect-error override
    window.IntersectionObserver = IntersectionObserver;
  }

  // MutationObserver mock
  if (typeof window.MutationObserver === 'undefined') {
    class MutationObserver {
      observe = () => {};
      disconnect = () => {};
      takeRecords = () => [];
    }

    window.MutationObserver = MutationObserver;
  }
}