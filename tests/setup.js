import '@testing-library/jest-dom';

// Mock next/dynamic so dynamic imports resolve synchronously in tests.
// Components that use dynamic() will render their fallback unless we mock them.
vi.mock('next/dynamic', () => ({
  default: (loader) => {
    // Return a simple wrapper that renders null — component-specific tests
    // should import the component directly, not through dynamic().
    const MockDynamic = () => null;
    MockDynamic.displayName = 'MockDynamic';
    return MockDynamic;
  },
}));

// Silence react-pdf worker URL warnings in the test environment.
vi.mock('react-pdf', () => ({
  Document: ({ children }) => children,
  Page: () => null,
  pdfjs: { GlobalWorkerOptions: {}, version: '3.0.0' },
}));

// Stub Web Audio API (used for radio-static sound effect).
global.AudioContext = vi.fn().mockImplementation(() => ({
  sampleRate: 44100,
  createBuffer: vi.fn(() => ({ getChannelData: vi.fn(() => new Float32Array()) })),
  createBufferSource: vi.fn(() => ({ buffer: null, connect: vi.fn(), start: vi.fn(), stop: vi.fn() })),
  createBiquadFilter: vi.fn(() => ({ type: '', frequency: { value: 0 }, Q: { value: 0 }, connect: vi.fn() })),
  currentTime: 0,
}));
global.webkitAudioContext = global.AudioContext;
