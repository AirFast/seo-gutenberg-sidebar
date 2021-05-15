import {__} from '@wordpress/i18n';
import {ToggleControl} from '@wordpress/components';
import {compose} from '@wordpress/compose';
import {withDispatch, withSelect} from '@wordpress/data';

const SEOImageIndexToggle = ({seoImageIndexValue, onSeoImageIndexChange}) => {
    const help = seoImageIndexValue ? __('Index the images on this page.', 'seo-gutenberg-sidebar') : __('Do not index images on this page.', 'seo-gutenberg-sidebar');

    return (
        <ToggleControl label={__('Should search engines index any images on a page?', 'seo-gutenberg-sidebar')} help={help}
                       checked={seoImageIndexValue}
                       onChange={value => onSeoImageIndexChange(value)}/>
    );
}

export default compose(
    withSelect(select => {
            return {
                seoImageIndexValue: select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data']['is_image_index']
            }
        }
    ),
    withDispatch(dispatch => {
            return {
                onSeoImageIndexChange: value => {
                    const data = wp.data.select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data'];

                    dispatch('core/editor').editPost({
                        meta: {
                            _seo_meta_data: {
                                ...data,
                                is_image_index: value ? 1 : 0
                            }
                        }
                    });
                }
            }
        }
    )
)(SEOImageIndexToggle);