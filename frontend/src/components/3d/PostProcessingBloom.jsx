import { Component } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

class PostProcessingErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('PostProcessing Bloom disabled:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default function PostProcessingBloom() {
  return (
    <PostProcessingErrorBoundary>
      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.8}
        />
        <Vignette
          eskil={false}
          offset={0.25}
          darkness={0.85}
        />
      </EffectComposer>
    </PostProcessingErrorBoundary>
  );
}
