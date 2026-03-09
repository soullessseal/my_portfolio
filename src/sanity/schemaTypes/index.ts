import type {SchemaTypeDefinition} from 'sanity'
import {featuredImageAsset} from './featuredImageAsset'
import {featuredVideoAsset} from './featuredVideoAsset'
import {migratedFeaturedMediaItem} from './migratedFeaturedMediaItem'
import {migratedImageItem} from './migratedImageItem'
import {project} from './project'
import {siteAssets} from './siteAssets'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [featuredImageAsset, featuredVideoAsset, migratedFeaturedMediaItem, migratedImageItem, project, siteAssets],
}
