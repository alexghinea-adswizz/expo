/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule verifyPropTypes
 * @flow
 */
'use strict';

var ReactNativeStyleAttributes = require('../Components/View/ReactNativeStyleAttributes');

export type ComponentInterface = React$ComponentType<any> | {
  name?: string,
  displayName?: string,
  propTypes: Object,
};

function verifyPropTypes(
  componentInterface: ComponentInterface,
  viewConfig: Object,
  nativePropsToIgnore?: ?Object
) {
  if (!viewConfig) {
    return; // This happens for UnimplementedView.
  }
  var componentName =
    componentInterface.displayName ||
    componentInterface.name ||
    'unknown';

  // ReactNative `View.propTypes` have been deprecated in favor of
  // `ViewPropTypes`. In their place a temporary getter has been added with a
  // deprecated warning message. Avoid triggering that warning here by using
  // temporary workaround, __propTypesSecretDontUseThesePlease.
  // TODO (bvaughn) Revert this particular change any time after April 1
  var propTypes =
    (componentInterface : any).__propTypesSecretDontUseThesePlease ||
    componentInterface.propTypes;

  if (!propTypes) {
    throw new Error(
      /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This
       * comment suppresses an error when upgrading Flow's support for React.
       * To see the error delete this comment and run Flow. */
      '`' + componentName + '` has no propTypes defined`'
    );
  }

  var nativeProps = viewConfig.NativeProps;
  for (var prop in nativeProps) {
    if (!propTypes[prop] &&
        !ReactNativeStyleAttributes[prop] &&
        (!nativePropsToIgnore || !nativePropsToIgnore[prop])) {
      var message;
      if (propTypes.hasOwnProperty(prop)) {
        /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This
         * comment suppresses an error when upgrading Flow's support for React.
         * To see the error delete this comment and run Flow. */
        message = '`' + componentName + '` has incorrectly defined propType for native prop `' +
        viewConfig.uiViewClassName + '.' + prop + '` of native type `' + nativeProps[prop];
      } else {
        /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This
         * comment suppresses an error when upgrading Flow's support for React.
         * To see the error delete this comment and run Flow. */
        message = '`' + componentName + '` has no propType for native prop `' +
        viewConfig.uiViewClassName + '.' + prop + '` of native type `' +
        nativeProps[prop] + '`';
      }
      message += '\nIf you haven\'t changed this prop yourself, this usually means that ' +
        'your versions of the native code and JavaScript code are out of sync. Updating both ' +
        'should make this error go away.';
      throw new Error(message);
    }
  }
}

module.exports = verifyPropTypes;
