import {__} from '@wordpress/i18n';
import {TextareaControl} from '@wordpress/components';
import {compose} from '@wordpress/compose';
import {withDispatch, withSelect} from '@wordpress/data';

const SEODescription = ({seoDescriptionValue, onSeoDescriptionChange}) => {
    const seoDescriptionLength = !!seoDescriptionValue ? seoDescriptionValue.length : '0';
    const help = !seoDescriptionValue
        ? __('Enter meta description for this page.', 'seo-gutenberg-sidebar')
        : 160 <= seoDescriptionLength
            ? __('Meta descriptions can be any length, but some search engines can truncate snippets to about 155-160 characters.', 'seo-gutenberg-sidebar')
            : __('We recommend that the meta description be sufficiently descriptive and should be between 50 to 160 characters.', 'seo-gutenberg-sidebar')

    return (
        <TextareaControl label={__('Meta description', 'seo-gutenberg-sidebar') + ' (' + seoDescriptionLength + '/160' + ')'}
                         help={help} value={seoDescriptionValue}
                         onChange={value => onSeoDescriptionChange(value)}/>
    );
}

export default compose(
    withSelect(select => {
        return {
            seoDescriptionValue: select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data']['description']
        }
    }),
    withDispatch(dispatch => {
        return {
            onSeoDescriptionChange: value => {
                const data = wp.data.select('core/editor').getEditedPostAttribute('meta')['_seo_meta_data'];

                dispatch('core/editor').editPost({
                    meta: {
                        _seo_meta_data: {
                            ...data,
                            description: value
                        }
                    }
                });
            }
        }
    })
)(SEODescription);