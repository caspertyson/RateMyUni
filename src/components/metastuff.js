import React from 'react';
import MetaTags from 'react-meta-tags';

class Component1 extends React.Component {
  render() {
    return (
        <div class="wrapper">
          <MetaTags>
            <title>Page 1</title>
            <meta id="meta-description" name="description" content="Some description." />
            <meta id="og-title" property="og:title" content="MyApp" />
            <meta id="og-image" property="og:image" content="path/to/image.jpg" />
          </MetaTags>
          <div class="content"> Some Content </div>
        </div>
      )
  }
}