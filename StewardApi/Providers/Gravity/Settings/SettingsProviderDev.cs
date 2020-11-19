using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Forza.WebServices.FMG.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings;
using Turn10.Settings.Dev;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity.Settings
{
    using Client = Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings;
    using Franchise = Turn10.Settings.Dev.Contracts;

    /// <inheritdoc />
    public class SettingsProviderDev : ISettingsProvider
    {
        private static readonly HttpClient HttpClient = new HttpClient();

        /// <inheritdoc />
        public async Task<Client.GameSettings> GetGameSettingAsync(Guid id)
        {
            var gsClient = new GameSettingsClient(HttpClient);
            var gameSettings = await gsClient.GetAsync(id);

            var carClient = new CarClient(HttpClient);
            var cars = (await carClient.GetListAsync(gameSettings.Cars)).Select(this.Convert);

            var currencyClient = new CurrencyClient(HttpClient);
            var currencies = (await currencyClient.GetListAsync(gameSettings.Currencies)).Select(this.Convert);

            var masteryKitClient = new MasteryKitClient(HttpClient);
            var masteryKits = (await masteryKitClient.GetListAsync(gameSettings.MasteryKits)).Select(this.Convert);

            var repairKitClient = new RepairKitClient(HttpClient);
            var repairKits = (await repairKitClient.GetListAsync(gameSettings.RepairKits)).Select(this.Convert);

            var upgradeKitClient = new UpgradeKitClient(HttpClient);
            var upgradeKits = (await upgradeKitClient.GetListAsync(gameSettings.UpgradeKits)).Select(this.Convert);

            var energyRefillClient = new EnergyRefillClient(HttpClient);
            var energyRefills = (await energyRefillClient.GetListAsync(gameSettings.EnergyRefills)).Select(this.Convert);

            IList<string> ftueStates;

            try
            {
                var ftueStateListClient = new FTUEStateListClient(HttpClient);
                var ftueStateList = await ftueStateListClient.GetAsync(gameSettings.FTUEStateList.Value);
                ftueStates = ftueStateList.Values.ToList();
            }
            catch
            {
                ftueStates = new List<string>();
            }

            var packDefinitionClient = new PackDefinitionClient(HttpClient);
            var packDefinitions = (await packDefinitionClient.GetListAsync(gameSettings.PackDefinitions)).Select(this.Convert);

            var heatClient = new HeatClient(HttpClient);
            var heats = (await heatClient.GetListAsync(gameSettings.Heats)).Select(this.Convert);

            return new Client.GameSettings
            {
                Cars = cars.ToList(),
                Currencies = currencies.ToList(),
                EnergyRefills = energyRefills.ToList(),
                MasteryKits = masteryKits.ToList(),
                RepairKits = repairKits.ToList(),
                UpgradeKits = upgradeKits.ToList(),
                PackDefinitions = packDefinitions.ToList(),
                FtueStates = ftueStates,
                CarClasses = Enum.GetNames(typeof(Franchise.CarClass)),
                CareerNodeTypes = Enum.GetNames(typeof(Franchise.CareerNodeNodeType)),
                CareerRewardTypes = Enum.GetNames(typeof(Franchise.RewardType)),
                CarEras = Enum.GetNames(typeof(Franchise.CarEra)),
                CarGrades = Enum.GetNames(typeof(Franchise.CarGrade)),
                HeatEventTypes = Enum.GetNames(typeof(Franchise.HeatEventType)),
                SubscriptionTiers = Enum.GetNames(typeof(LiveOpsSubscriptionTier)),
                UpgradeRequirementItemTypes = Enum.GetNames(typeof(Franchise.UpgradeRequirementItemType)),
                UpgradeTiers = Enum.GetNames(typeof(Franchise.UpgradeKitUpgradeTier)),
                HeatDetails = heats.ToList()
            };
        }

        private GameDataItem<int> Convert(Franchise.PackDefinition c)
        {
            return new GameDataItem<int>
            {
                Details = 0,
                CreatedBy = c.CreatedBy,
                Created = c.Created.Value,
                ItemId = c.PackId.Value,
                LastUpdatedBy = c.LastUpdatedBy,
                LastUpdated = c.LastUpdated.Value,
                Name = c.PackName,
                SettingsId = c.Id.Value
            };
        }

        private Client.GameDataItem<EnergyRefillDetails> Convert(Franchise.EnergyRefill c)
        {
            return new GameDataItem<EnergyRefillDetails>
            {
                Details = new EnergyRefillDetails
                {
                    IsFull = c.IsFull.Value,
                    PartialValue = c.PartialValue.Value
                },
                CreatedBy = c.CreatedBy,
                ItemId = c.RefillId.Value,
                LastUpdatedBy = c.LastUpdatedBy,
                Name = c.IsFull.Value ? $"Full Energy Refill" : $"{c.PartialValue.Value} Point Energy Refill",
                SettingsId = c.Id.Value
            };
        }

        private Client.GameDataItem<UpgradeKitDetails> Convert(Franchise.UpgradeKit c)
        {
            return new GameDataItem<UpgradeKitDetails>
            {
                Details = new UpgradeKitDetails
                {
                    CarClass = c.CarClass.Value.ToString("g"),
                    UpgradeTier = c.UpgradeTier.Value.ToString("g")
                },
                CreatedBy = c.CreatedBy,
                ItemId = c.KitId.Value,
                LastUpdatedBy = c.LastUpdatedBy,
                Name = $"{c.UpgradeTier:G} {c.CarClass:G} Upgrade Kit",
                SettingsId = c.Id.Value
            };
        }

        private Client.GameDataItem<RepairKitDetails> Convert(Franchise.RepairKit c)
        {
            return new Client.GameDataItem<RepairKitDetails>
            {
                Details = new RepairKitDetails
                {
                    RepairValue = c.RepairValue.Value,
                    StarRatingRequirement = c.StarRatingRequirement.Value
                },
                CreatedBy = c.CreatedBy,
                ItemId = c.KitId.Value,
                LastUpdatedBy = c.LastUpdatedBy,
                Name = $"{c.StarRatingRequirement.Value} Star Repair Kit",
                SettingsId = c.Id.Value
            };
        }

        private Client.GameDataItem<int> Convert(Franchise.Currency c)
        {
            return new Client.GameDataItem<int>
            {
                Details = -1,
                CreatedBy = c.CreatedBy,
                Description = c.Description,
                ImageUrl = c.ImageUri,
                ItemId = c.CurrencyId.Value,
                LastUpdatedBy = c.LastUpdatedBy,
                Name = c.Name,
                SettingsId = c.Id.Value
            };
        }

        private Client.GameDataItem<MasteryKitDetails> Convert(Franchise.MasteryKit c)
        {
            return new Client.GameDataItem<MasteryKitDetails>
            {
                Details = new MasteryKitDetails
                {
                    CarClass = c.CarClass.Value.ToString("g"),
                    ClassBonusValue = c.ClassBonusValue.Value,
                    CurrencyModifier = c.CurrencyModifier.Value,
                    CurrencyId = c.CurrencyType.Value,
                    Value = c.Value.Value
                },
                CreatedBy = c.CreatedBy,
                ItemId = c.KitId.Value,
                LastUpdatedBy = c.LastUpdatedBy,
                Name = $"{c.CarClass:G} {c.Value.Value} Mastery Kit"
            };
        }

        private Client.GameDataItem<CarDetails> Convert(Franchise.Car c)
        {
            return new Client.GameDataItem<CarDetails>
            {
                Details = new CarDetails
                {
                    CarClass = c.CarClass.Value.ToString("g"),
                    CarId = c.CarId.Value,
                    CarName = c.CarName,
                    CountryId = c.CountryId.Value,
                    DuplicateRewardsPackage = c.DuplicateRewardsPackage.Value,
                    Era = c.Era.Value.ToString("g"),
                    Grade = c.Grade.Value.ToString("g"),
                    ManufacturerId = c.ManufacturerId.Value,
                    MaxConditionPips = c.MaxConditionPips.Value,
                    MaxPerformanceIndex = c.MaxPerformanceIndex.Value,
                    MinPerformanceIndex = c.MinPerformanceIndex.Value,
                    ModelId = c.ModelId.Value,
                    ReleaseYear = c.ReleaseYear.Value,
                    TransitionCarId = c.TransitionCarId.Value,
                    StarRanks = c.StarRanks.Select(this.Convert).ToList(),
                    StarRating = c.StarRating.Value
                },

                CreatedBy = c.CreatedBy,
                ItemId = c.CarId.Value,
                LastUpdatedBy = c.LastUpdatedBy,
                Name = $"{c.StarRating} Star {c.CarName}",
                SettingsId = c.Id.Value
            };
        }

        private Client.StarRank Convert(Franchise.StarRank starRank)
        {
            return new Client.StarRank
            {
                Id = starRank.Id.Value,
                MasteryLevelSpacingCoefficients = starRank.MasteryLevelSpacingCoefficients.ToList(),
                MaxLevel = starRank.MaxLevel.Value,
                PILowerThresholdProportion = starRank.PILowerThresholdProportion.Value,
                PIUpperThresholdProportion = starRank.PIUpperThresholdProportion.Value,
                Rank = starRank.Rank.Value,
                RequiredUpgrades = starRank.RequiredUpgrades.Select(this.Convert).ToList(),
                TotalMasteryThreshold = starRank.TotalMasteryThreshold.Value
            };
        }

        private Client.UpgradeRequirement Convert(Franchise.UpgradeRequirement upgradeRequirement)
        {
            return new Client.UpgradeRequirement
            {
                CreatedBy = upgradeRequirement.CreatedBy,
                ItemId = upgradeRequirement.ItemId.Value,
                Id = upgradeRequirement.Id.Value,
                LastUpdatedBy = upgradeRequirement.LastUpdatedBy,
                ItemQuantity = upgradeRequirement.ItemQuantity.Value,
                ItemType = upgradeRequirement.ItemType.Value.ToString("g")
            };
        }

        private GameDataItem<HeatDetails> Convert(Franchise.Heat heat)
        {
            return new GameDataItem<HeatDetails>
            {
                Details = new HeatDetails
                {
                    AlwaysUnlocked = heat.AlwaysUnlocked.Value,
                    DefaultEnergyCost = heat.DefaultEnergyCost.Value,
                    EventType = heat.EventType.Value.ToString("G"),
                    HeatId = heat.HeatId.Value,
                    Id = heat.Id.Value
                },
                Created = heat.Created.Value,
                CreatedBy = heat.CreatedBy,
                LastUpdated = heat.LastUpdated.Value,
                LastUpdatedBy = heat.LastUpdatedBy,
                Description = $"{heat.EventType.Value:G} Heat {heat.HeatId.Value}",
                ItemId = heat.HeatId.Value,
                Name = $"{heat.EventType.Value:G} Heat {heat.HeatId.Value}",
                SettingsId = heat.Id.Value
            };
        }

        private Client.HeatNode Convert(Franchise.HeatNode heatNode)
        {
            return new Client.HeatNode
            {
                Id = heatNode.Id.Value,
                Destinations = heatNode.Destinations.ToList(),
                EnergyCost = heatNode.EnergyCost.Value,
                Type = heatNode.Type.Value.ToString("G")
            };
        }
    }
}
