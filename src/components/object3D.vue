<script>
import MapMixin from '../mixins/map';

export const Object3D = {
  mixins: [MapMixin],

  props: {
    // 模型路径
    modelSourcePath: {
      type: String,
      default: '',
    },
    // 光照配置
    lightOption: {
      type: Object,
      default: () => ({
        ambientLight: [[1, 1, 1], 1],
        directionLight: [[1, 0, -0.5], [1, 1, 1], 0.5],
      }),
    },
    // 模型配置
    modelOption: {
      type: Object,
      default: () => ({
        modelOption: {
          position: [104.069755, 30.61565],
          scale: 10,
          height: 10,
          scene: 0,
        },
      }),
    },
  },

  watch: {
    map (value) {
      if (value && typeof AMapUI === 'undefined') {
        this.load3DSource();
      }
    },
  },

  methods: {
    load3DSource () {
      // 光线配置，即光照，打光
      this.map.AmbientLight = new AMap.Lights.AmbientLight(
        ...this.lightOption.ambientLight
      );
      this.map.DirectionLight = new AMap.Lights.DirectionLight(
        ...this.lightOption.directionLight
      );
      // 添加Object3DLayer图层，用来承载3D模型
      const object3Dlayer = new AMap.Object3DLayer();
      this.map.add(object3Dlayer);
      AMap.plugin(['AMap.GltfLoader'], () => {
        // 创建AMap.GltfLoader插件实例
        const gltf = new AMap.GltfLoader();
        // 调用load方法，加载 glTF 模型资源
        const model_source_path = this.modelSourcePath;
        const urlDuck = `/${model_source_path}.gltf`;
        gltf.load(urlDuck, (gltfModel) => {
          // gltfModel 为解析后的gltf对象
          const {
            position, scale, height, scene,
          } = this.modelOption;
          gltfModel.setOption({
            position: new AMap.LngLat(position[0], position[1]),
            scale, // 非必须，默认1
            height, // 非必须，默认0
            scene, // 非必须，默认0
          });
          gltfModel.rotateX(90);
          gltfModel.rotateZ(0);
          object3Dlayer.add(gltfModel);
        });
      });
    },
  },
};

export default Object3D;
</script>
