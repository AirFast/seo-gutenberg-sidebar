import {__} from '@wordpress/i18n';
import {ToggleControl} from '@wordpress/components';
import {compose} from '@wordpress/compose';
import {withDispatch, withSelect} from '@wordpress/data';

const SEOArchiveToggle = ({seoArchiveValue, onSeoArchiveChange}) => {
    const help = seoArchiveValue ? __('Show a cached link in search results.', 'textdomain') : __('Do not show a cached link in search results.', 'textdomain');

    return (
        <ToggleControl
            label={__('Allow search engines to show a cached link to this page in search results?', 'textdomain')}
            help={help}
            checked={seoArchiveValue}
            onChange={value => onSeoArchiveChange(value)}/>
    );
}

export default compose(
    withSelect(select => {
            return {
                seoArchiveValue: select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data']['is_archive']
            }
        }
    ),
    withDispatch(dispatch => {
            return {
                onSeoArchiveChange: value => {
                    const data = wp.data.select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data'];

                    dispatch('core/editor').editPost({
                        meta: {
                            _seo_meta_data: {
                                ...data,
                                is_archive: value ? 1 : 0
                            }
                        }
                    });
                }
            }
        }
    )
)(SEOArchiveToggle);