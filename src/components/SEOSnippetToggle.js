import {__} from '@wordpress/i18n';
import {ToggleControl} from '@wordpress/components';
import {compose} from '@wordpress/compose';
import {withDispatch, withSelect} from '@wordpress/data';

const SEOSnippetToggle = ({seoSnippetValue, onSeoSnippetChange}) => {
    const help = seoSnippetValue ? __('Show a snippet in search results.', 'textdomain') : __('Do not show a snippet in search results.', 'textdomain');

    return (
        <ToggleControl
            label={__('Allow search engines to show a snippet of this page (i.e. meta description) in search results?', 'textdomain')}
            help={help}
            checked={seoSnippetValue}
            onChange={value => onSeoSnippetChange(value)}/>
    );
}

export default compose(
    withSelect(select => {
            return {
                seoSnippetValue: select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data']['is_snippet']
            }
        }
    ),
    withDispatch(dispatch => {
            return {
                onSeoSnippetChange: value => {
                    const data = wp.data.select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data'];

                    dispatch('core/editor').editPost({
                        meta: {
                            _seo_meta_data: {
                                ...data,
                                is_snippet: value ? 1 : 0
                            }
                        }
                    });
                }
            }
        }
    )
)(SEOSnippetToggle);