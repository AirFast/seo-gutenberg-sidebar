import {__} from '@wordpress/i18n';
import {ToggleControl} from '@wordpress/components';
import {compose} from '@wordpress/compose';
import {withDispatch, withSelect} from '@wordpress/data';

const SEOFollowToggle = ({seoFollowValue, onSeoFollowChange}) => {
    const help = seoFollowValue ? __('Search engines can follow the links on this page.', 'seo-gutenberg-sidebar') : __('Search engines cannot follow the links on this page.', 'seo-gutenberg-sidebar');

    return (
        <ToggleControl label={__('Should search engines follow links on this page and index them?', 'seo-gutenberg-sidebar')}
                       help={help}
                       checked={seoFollowValue}
                       onChange={value => onSeoFollowChange(value)}/>
    );
}

export default compose(
    withSelect(select => {
            return {
                seoFollowValue: select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data']['is_follow']
            }
        }
    ),
    withDispatch(dispatch => {
            return {
                onSeoFollowChange: value => {
                    const data = wp.data.select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data'];

                    dispatch('core/editor').editPost({
                        meta: {
                            _seo_meta_data: {
                                ...data,
                                is_follow: value ? 1 : 0
                            }
                        }
                    });
                }
            }
        }
    )
)(SEOFollowToggle);