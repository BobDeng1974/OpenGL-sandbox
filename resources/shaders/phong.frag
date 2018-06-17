#version 330 core

struct Material
{
	vec3 color;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct PointLight
{
	int active;
	vec3 position;
	vec3 color;
	
	float attConstant;
	float attLinear;
	float attQuadratic;
};

uniform float uAmbientStrength;
uniform float uDiffuseStrength;
uniform float uSpecularStrength;
uniform int uEnableNormalMapping;
uniform int uUseBlinnPhong;
uniform vec3 uViewPos;
uniform Material uMaterial;
uniform sampler2D texture_diffuse;
uniform sampler2D texture_specular;
uniform sampler2D texture_normal;

#define MAX_LIGHTS 16
uniform PointLight uLight[MAX_LIGHTS];

in vec3 Normal;
in vec3 FragPos;
in vec2 TexCoords;
in mat3 TBN;

out vec4 FragColor;


vec3 pointLight(PointLight light, vec3 normal, vec3 viewDir)
{
	vec3 lightDir = normalize(light.position - FragPos);
		
	// Ambient
	vec3 ambient = uMaterial.ambient * uAmbientStrength;
	
	// Diffuse
	vec3 diffuse = uMaterial.diffuse * max(0.0, dot(normal, lightDir)) * uDiffuseStrength;
	
	// Specular
	float specAngle;
	
	if(uUseBlinnPhong != 0)
	{
		vec3 halfDir = normalize(lightDir + viewDir);
		specAngle = pow(max(0.0, dot(halfDir, normal)), 4);
	}
	else
	{
		vec3 reflectDir = reflect(-lightDir, normal);
		specAngle = max(0.0, dot(viewDir, reflectDir));
	}
	
	float specularStrength = pow(specAngle, uMaterial.shininess) * uSpecularStrength;
	vec3 specular = uMaterial.specular * specularStrength * vec3(texture(texture_specular, TexCoords));
	
	// Attenuation
	float distance = length(light.position - FragPos);
	float attenuation = 1.0 / (light.attConstant + light.attLinear * distance + light.attQuadratic * distance * distance);
	
	return light.color * (ambient + diffuse + specular) * attenuation;
}


void main()
{
	vec4 objectColor = vec4(vec3(texture(texture_diffuse, TexCoords)) * uMaterial.color, 1.f);
	vec3 lightTotal = vec3(0.f);
	vec3 norm;
	
	if(uEnableNormalMapping != 0) // Normal mapping
		norm = normalize(TBN * (texture(texture_normal, TexCoords).rgb * 2.0 - 1.0));
	else // Standard normals
		norm = normalize(Normal);
	
	vec3 viewDir = normalize(uViewPos - FragPos);
	
	for(int i = 0; i < MAX_LIGHTS; ++i)
	if(uLight[i].active != 0)
		lightTotal += pointLight(uLight[i], norm, viewDir);
	
	FragColor = objectColor * vec4(lightTotal, 1.0);
}
