import {__} from '@wordpress/i18n';
import {ToggleControl} from '@wordpress/components';
import {compose} from '@wordpress/compose';
import {withDispatch, withSelect} from '@wordpress/data';

const SEOIndexToggle = ({seoIndexValue, onSeoIndexChange}) => {
    const help = seoIndexValue ? __('Index and show this page in search results.', 'seo-gutenberg-sidebar') : __('Do not index and not show this page in search results.', 'seo-gutenberg-sidebar');

    return (
        <ToggleControl label={__('Allow search engines to show this page in search results?', 'seo-gutenberg-sidebar')} help={help}
                       checked={seoIndexValue}
                       onChange={value => onSeoIndexChange(value)}/>
    );
}

export default compose(
    withSelect(select => {
            return {
                seoIndexValue: select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data']['is_index']
            }
        }
    ),
    withDispatch(dispatch => {
            return {
                onSeoIndexChange: value => {
                    const data = wp.data.select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data'];

                    dispatch('core/editor').editPost({
                        meta: {
                            _seo_meta_data: {
                                ...data,
                                is_index: value ? 1 : 0
                            }
                        }
                    });
                }
            }
        }
    )
)(SEOIndexToggle);